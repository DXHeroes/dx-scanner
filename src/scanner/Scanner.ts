import { cli } from 'cli-ux';
import fs from 'fs';
import { inject, injectable, multiInject } from 'inversify';
import _ from 'lodash';
import os from 'os';
import path from 'path';
import git from 'simple-git/promise';
import GitUrlParse from 'git-url-parse';
import url from 'url';
import { inspect } from 'util';
import { ArgumentsProvider } from '.';
import { LanguageContext } from '../contexts/language/LanguageContext';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import { ScannerContext } from '../contexts/scanner/ScannerContext';
import { ScanningStrategy } from '../detectors';
import { AccessType, ServiceType } from '../detectors/IScanningStrategy';
import { debugLog, sharedSubpath } from '../detectors/utils';
import { ErrorFactory } from '../lib/errors';
import {
  LanguageAtPath,
  PracticeEvaluationResult,
  PracticeImpact,
  ProjectComponent,
  ProjectComponentFramework,
  ProjectComponentPlatform,
  ProjectComponentType,
} from '../model';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { IReporter, PracticeWithContextForReporter } from '../reporters';
import { ScannerUtils } from '../scanner/ScannerUtils';
import { FileSystemService } from '../services';
import { DiscoveryContextFactory, Types } from '../types';
import { ScanningStrategyExplorer } from './ScanningStrategyExplorer';

@injectable()
export class Scanner {
  private readonly scanStrategyExplorer: ScanningStrategyExplorer;
  private readonly discoveryContextFactory: DiscoveryContextFactory;
  private readonly fileSystemService: FileSystemService;
  private readonly practices: IPracticeWithMetadata[];
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly d: (...args: unknown[]) => void;
  private shouldExitOnEnd = false;
  private allDetectedComponents: ProjectComponentAndLangContext[] | undefined;

  constructor(
    @inject(ScanningStrategyExplorer) scanStrategyExplorer: ScanningStrategyExplorer,
    @inject(Types.DiscoveryContextFactory) discoveryContextFactory: DiscoveryContextFactory,
    @inject(FileSystemService) fileSystemService: FileSystemService,
    // inject all practices registered under Types.Practice in inversify config
    @multiInject(Types.Practice) practices: IPracticeWithMetadata[],
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
  ) {
    this.scanStrategyExplorer = scanStrategyExplorer;
    this.discoveryContextFactory = discoveryContextFactory;
    this.fileSystemService = fileSystemService;
    this.practices = practices;
    this.argumentsProvider = argumentsProvider;

    this.d = debugLog('scanner');
    this.allDetectedComponents = undefined;
  }

  async scan({ determineRemote } = { determineRemote: true }): Promise<ScanResult> {
    const repositoryConfig = await this.scanStrategyExplorer.explore();
    this.d(`Resitory Config: ${inspect(repositoryConfig)}`);

    const discoveryContext = this.discoveryContextFactory(repositoryConfig);

    let scanStrategy = await discoveryContext.scanningStrategyDetector.detect();
    this.d(`Scan stgy: ${inspect(scanStrategy)}`);
    this.d(`Scan strategy detected: ${inspect(scanStrategy)}`);
    if (determineRemote && (scanStrategy.serviceType === undefined || scanStrategy.accessType === AccessType.unknown)) {
      return {
        shouldExitOnEnd: this.shouldExitOnEnd,
        needsAuth: true,
        serviceType: scanStrategy.serviceType,
        isOnline: scanStrategy.isOnline,
      };
    }
    const isLocal = !scanStrategy.localPath;
    scanStrategy = await this.preprocessData(scanStrategy);
    console.error(process.env.PWD);
    console.error(process.cwd());
    console.error('TEST LOG');
    this.d(`Scan strategy (after preprocessing): ${inspect(scanStrategy)}`);
    const scannerContext = discoveryContext.getScanningContext(scanStrategy);
    const languagesAtPaths = await this.detectLanguagesAtPaths(scannerContext);
    if (!languagesAtPaths.length) {
      cli.warn('No language was detected. Score will be 0%.');
    }
    this.d(`LanguagesAtPaths (${languagesAtPaths.length}):`, inspect(languagesAtPaths));
    const projectComponents = await this.detectProjectComponents(languagesAtPaths, scannerContext, scanStrategy);
    this.d(`Components (${projectComponents.length}):`, inspect(projectComponents));
    const practicesWithContext = await this.detectPractices(projectComponents);
    this.d(`Practices (${practicesWithContext.length}):`, inspect(practicesWithContext));

    let practicesAfterFix: PracticeWithContext[] | undefined;
    if (this.argumentsProvider.fix) {
      if (isLocal) {
        cli.warn('`fix` command only works for local folder, not for online repositories');
      } else {
        await this.fix(practicesWithContext);
        practicesAfterFix = await this.detectPractices(projectComponents);
      }
    }
    await this.report(scannerContext.reporters, practicesWithContext, practicesAfterFix);
    this.d(
      `Overall scan stats. LanguagesAtPaths: ${inspect(languagesAtPaths.length)}; Components: ${inspect(
        this.allDetectedComponents!.length,
      )}; Practices: ${inspect(practicesWithContext.length)}.`,
    );

    if (practicesWithContext.length > 0 && practicesWithContext[0].componentContext.configProvider.config)
      debugLog('config')('Project configuration: \n' + inspect(practicesWithContext[0].componentContext.configProvider.config));
    else debugLog('config')('No project configuration found');

    return { shouldExitOnEnd: this.shouldExitOnEnd };
  }

  /**
   * Initialize Scanner configuration
   */
  async init(scanPath: string): Promise<void> {
    const filePath = scanPath + '.dxscannerrc';
    cli.action.start(`Initializing configuration: ${filePath}.yaml`);
    // check if .dxscannerrc.yaml already exists
    const fileExists: boolean = await this.fileSystemService.exists(`${filePath}`);
    const yamlExists: boolean = await this.fileSystemService.exists(`${filePath}.yaml`);
    const ymlExists: boolean = await this.fileSystemService.exists(`${filePath}.yml`);
    const jsonExists: boolean = await this.fileSystemService.exists(`${filePath}.json`);

    if (!yamlExists && !fileExists && !ymlExists && !jsonExists) {
      await this.createConfiguration(filePath);
    } else {
      cli.warn('You already have a dx-scanner config.');
    }

    cli.action.stop();
  }

  async fix(practicesWithContext: PracticeWithContext[], scanningStrategy?: ScanningStrategy): Promise<void> {
    if (!this.argumentsProvider.fix) return;
    const fixablePractice = (p: PracticeWithContext) => p.practice.fix && p.evaluation === PracticeEvaluationResult.notPracticing;
    const fixPatternMatcher = this.argumentsProvider.fixPattern ? new RegExp(this.argumentsProvider.fixPattern, 'i') : null;
    const shouldFix = (p: PracticeWithContext) => {
      const fixFromCli = fixPatternMatcher ? fixPatternMatcher.test(p.practice.getMetadata().id) : undefined;
      const practiceConfig = p.componentContext.configProvider.getOverriddenPractice(p.practice.getMetadata().id);
      const fixFromConfig = practiceConfig?.fix;
      return fixFromCli !== undefined ? fixFromCli : fixFromConfig !== undefined ? fixFromConfig : true;
    };
    await Promise.all(
      practicesWithContext
        .filter(fixablePractice)
        .filter(shouldFix)
        .map((p) =>
          p.practice.fix!({
            ...p.practiceContext,
            scanningStrategy,
            config: p.componentContext.configProvider.getOverriddenPractice(p.practice.getMetadata().id),
            argumentsProvider: this.argumentsProvider,
          }),
        ),
    );
  }

  /**
   * Clone a repository if the input is remote repository
   */
  private async preprocessData(scanningStrategy: ScanningStrategy) {
    const { serviceType, accessType, remoteUrl, rootPath, isOnline } = scanningStrategy;
    let { localPath } = scanningStrategy;

    if (!isOnline) {
      return { serviceType, accessType, remoteUrl, localPath, rootPath, isOnline };
    }

    if (localPath === undefined && remoteUrl !== undefined && serviceType !== ServiceType.local) {
      const cloneUrl = new url.URL(remoteUrl);

      localPath = fs.mkdtempSync(path.join(os.tmpdir(), 'dx-scanner'));

      if (this.argumentsProvider.auth?.includes(':')) {
        cloneUrl.username = this.argumentsProvider.auth.split(':')[0];
        cloneUrl.password = this.argumentsProvider.auth.split(':')[1];
      } else if (this.argumentsProvider.auth) {
        cloneUrl.password = this.argumentsProvider.auth;

        if (serviceType === ServiceType.gitlab) {
          cloneUrl.username = 'private-token';
        }
        if (serviceType === ServiceType.github) {
          cloneUrl.username = 'access-token';
        }
        if (serviceType === ServiceType.bitbucket) {
          cloneUrl.username = GitUrlParse(this.argumentsProvider.uri).owner;
        }
      }

      await git().silent(true).clone(cloneUrl.href, localPath, { '--depth': '100' });
    }

    return { serviceType, accessType, remoteUrl, localPath, rootPath: rootPath || localPath, isOnline };
  }

  /**
   * Detect all languages
   */
  private async detectLanguagesAtPaths(context: ScannerContext) {
    let languagesAtPaths: LanguageAtPath[] = [];
    const languageDetectors = await Promise.all(context.languageDetectors.map((languageDetector) => languageDetector.detectLanguage()));

    for (const languageDetector of languageDetectors) {
      languagesAtPaths = [...languagesAtPaths, ...languageDetector];
    }

    return languagesAtPaths;
  }

  /**
   * Detect project components (backend, frontend, libraries, etc.)
   */
  private async detectProjectComponents(languagesAtPaths: LanguageAtPath[], context: ScannerContext, strategy: ScanningStrategy) {
    let components: ProjectComponentAndLangContext[] = [];
    for (const langAtPath of languagesAtPaths) {
      const langContext = context.getLanguageContext(langAtPath);
      await langContext.init();
      const detectors = langContext.getProjectComponentDetectors();
      for (const componentDetector of detectors) {
        const componentsWithContext = (await componentDetector.detectComponent(langAtPath)).map((c) => {
          if (strategy.remoteUrl) {
            c.repositoryPath = strategy.remoteUrl;
          }
          return {
            component: c,
            languageContext: langContext,
          };
        });
        // Add an unknown component for the language at path if we could not detect particular component
        if (langAtPath && componentsWithContext.length === 0) {
          components = [
            ...components,
            {
              languageContext: langContext,
              component: {
                framework: ProjectComponentFramework.UNKNOWN,
                language: langContext.language,
                path: langAtPath.path,
                platform: ProjectComponentPlatform.UNKNOWN,
                type: ProjectComponentType.UNKNOWN,
                repositoryPath: undefined,
              },
            },
          ];
        } else {
          components = [...components, ...componentsWithContext];
        }
      }
    }
    this.allDetectedComponents = components;
    return await this.getRelevantComponents(components);
  }
  /**
   * Detect applicable practices for each component
   */
  private async detectPractices(componentsWithContext: ProjectComponentAndLangContext[]): Promise<PracticeWithContext[]> {
    const practicesWithComponentContext = await Promise.all(
      componentsWithContext.map(async (cwctx) => await this.detectPracticesForComponent(cwctx)),
    );
    const practicesWithContext = _.flatten(practicesWithComponentContext);

    this.d('Applicable practices:');
    this.d(practicesWithContext.map((p) => p.practice.getMetadata().name));

    return practicesWithContext;
  }

  /**
   * Report result with specific reporter
   */
  private async report(
    reporters: IReporter[],
    practicesWithContext: PracticeWithContext[],
    practicesWithContextAfterFix?: PracticeWithContext[],
  ): Promise<void> {
    const pwcForReporter = (p: PracticeWithContext) => {
      const config = p.componentContext.configProvider.getOverriddenPractice(p.practice.getMetadata().id);
      const overridenImpact = config?.impact;

      return {
        component: p.componentContext.projectComponent,
        practice: { ...p.practice.getMetadata(), data: p.practice.data, fix: Boolean(p.practice.fix) },
        evaluation: p.evaluation,
        evaluationError: p.evaluationError,
        overridenImpact: <PracticeImpact>(overridenImpact || p.practice.getMetadata().impact),
        isOn: p.isOn,
      };
    };
    const relevantPractices: PracticeWithContextForReporter[] = practicesWithContext.map(pwcForReporter);

    this.d(`Reporters length: ${reporters.length}`);
    if (practicesWithContextAfterFix) {
      const relevantPracticesAfterFix: PracticeWithContextForReporter[] = practicesWithContextAfterFix.map(pwcForReporter);
      await Promise.all(reporters.map((r) => r.report(relevantPractices, relevantPracticesAfterFix)));
    } else {
      await Promise.all(reporters.map(async (r) => await r.report(relevantPractices)));
    }

    if (this.allDetectedComponents!.length > 1 && !this.argumentsProvider.recursive) {
      cli.info(
        `Found more than 1 component. To scan all ${
          this.allDetectedComponents!.length
        } components run the scanner with an argument --recursive\n`,
      );
    }

    const notPracticingPracticesToFail = ScannerUtils.filterNotPracticingPracticesToFail(relevantPractices, this.argumentsProvider);
    if (notPracticingPracticesToFail.length > 0) {
      this.shouldExitOnEnd = true;
    }
  }

  /**
   * Detect and evaluate applicable practices for a given component
   */
  private async detectPracticesForComponent(componentWithCtx: ProjectComponentAndLangContext): Promise<PracticeWithContext[]> {
    const practicesWithContext: PracticeWithContext[] = [];

    const componentContext = componentWithCtx.languageContext.getProjectComponentContext(componentWithCtx.component);
    const practiceContext = componentContext.getPracticeContext();

    await componentContext.configProvider.init();

    const filteredPractices = await ScannerUtils.filterPractices(componentContext, this.practices);
    const orderedApplicablePractices = ScannerUtils.sortPractices(filteredPractices.customApplicablePractices);

    /**
     * Evaluate practices in correct order
     */
    for (const practice of orderedApplicablePractices) {
      const practiceConfig = componentContext.configProvider.getOverriddenPractice(practice.getMetadata().id);
      const isFulfilled = ScannerUtils.isFulfilled(practice, practicesWithContext);

      if (!isFulfilled) continue;

      let evaluation = PracticeEvaluationResult.unknown;
      let evaluationError: undefined | string;
      try {
        evaluation = await practice.evaluate({ ...practiceContext, config: practiceConfig });
      } catch (error) {
        evaluationError = error.toString();
        const practiceDebug = debugLog('practices');
        practiceDebug(`The ${practice.getMetadata().name} practice failed with this error:\n${error.stack}`);
      }

      const practiceWithContext: PracticeWithContext = {
        practice,
        componentContext,
        practiceContext,
        evaluation,
        evaluationError,
        isOn: true,
      };

      practicesWithContext.push(practiceWithContext);
    }

    /**
     * Add turned off practices to result
     */
    for (const practice of filteredPractices.practicesOff) {
      const practiceWithContext = {
        practice,
        componentContext,
        practiceContext,
        evaluation: PracticeEvaluationResult.unknown,
        evaluationError: undefined,
        isOn: false,
      };

      practicesWithContext.push(practiceWithContext);
    }

    return practicesWithContext;
  }

  /**
   * Get all relevant components.
   */
  private async getRelevantComponents(componentsWithContext: ProjectComponentAndLangContext[]) {
    let relevantComponents = componentsWithContext;

    if (!this.argumentsProvider.recursive && relevantComponents.length > 1) {
      const componentsSharedPath = sharedSubpath(relevantComponents.map((cwc) => cwc.component.path));
      const componentsAtRootPath = relevantComponents.filter((cwc) => cwc.component.path === componentsSharedPath);

      // scan the first component only if recursion flag is not true && there are more than 1 components on root
      relevantComponents = [relevantComponents[0]];

      // do not scan only root path if found 0 components there
      if (componentsAtRootPath.length > 0) {
        relevantComponents = componentsAtRootPath;
      }
    }
    return relevantComponents;
  }

  private async createConfiguration(filePath: string) {
    let yamlInitContent = `# practices:`;
    // get Metadata and sort it alphabetically using id
    for (const practice of this.listPractices()) {
      const dataObject = practice.getMetadata();
      yamlInitContent += `\n#    ${dataObject.id}: ${dataObject.impact}`;
    }
    try {
      await this.fileSystemService.writeFile(`${filePath}.yaml`, yamlInitContent);
    } catch (err) {
      throw ErrorFactory.newInternalError(`Error during configuration file initialization: ${err.message}`);
    }
  }

  listPractices(): IPracticeWithMetadata[] {
    return ScannerUtils.sortAlphabetically(this.practices);
  }
}

interface ProjectComponentAndLangContext {
  component: ProjectComponent;
  languageContext: LanguageContext;
}

export interface PracticeWithContext {
  componentContext: ProjectComponentContext;
  practiceContext: PracticeContext;
  practice: IPracticeWithMetadata;
  evaluation: PracticeEvaluationResult;
  evaluationError: undefined | string;
  isOn: boolean;
}

export type ScanResult = {
  shouldExitOnEnd: boolean;
  needsAuth?: boolean;
  serviceType?: ServiceType;
  isOnline?: boolean;
};
