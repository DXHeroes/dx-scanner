import debug from 'debug';
import fs from 'fs';
import { inject, injectable, multiInject } from 'inversify';
import os from 'os';
import path from 'path';
import git from 'simple-git/promise';
import url from 'url';
import { inspect } from 'util';
import {
  LanguageAtPath,
  PracticeEvaluationResult,
  ProjectComponent,
  ProjectComponentFramework,
  ProjectComponentPlatform,
  ProjectComponentType,
  PracticeImpact,
} from '../model';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { ScannerContextFactory, Types } from '../types';
import { ScannerUtils } from '../scanner/ScannerUtils';
import _ from 'lodash';
import { cli } from 'cli-ux';
import { ScanningStrategyDetector, ScanningStrategy, ServiceType } from '../detectors';
import { IReporter } from '../reporters';
import { FileSystemService } from '../services';
import { ScannerContext } from '../contexts/scanner/ScannerContext';
import { sharedSubpath } from '../detectors/utils';
import { LanguageContext } from '../contexts/language/LanguageContext';
import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import { ArgumentsProvider } from '.';

@injectable()
export class Scanner {
  private readonly scanStrategyDetector: ScanningStrategyDetector;
  private readonly scannerContextFactory: ScannerContextFactory;
  private readonly reporters: IReporter[];
  private readonly fileSystemService: FileSystemService;
  private readonly practices: IPracticeWithMetadata[];
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly d: debug.Debugger;
  private shouldExitOnEnd = false;
  private allDetectedComponents: ProjectComponentAndLangContext[] | undefined;

  constructor(
    @inject(ScanningStrategyDetector) scanStrategyDetector: ScanningStrategyDetector,
    @inject(Types.ScannerContextFactory) scannerContextFactory: ScannerContextFactory,
    @multiInject(Types.IReporter) reporters: IReporter[],
    @inject(FileSystemService) fileSystemService: FileSystemService,
    // inject all practices registered under Types.Practice in inversify config
    @multiInject(Types.Practice) practices: IPracticeWithMetadata[],
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
  ) {
    this.scanStrategyDetector = scanStrategyDetector;
    this.scannerContextFactory = scannerContextFactory;
    this.reporters = reporters;
    this.fileSystemService = fileSystemService;
    this.practices = practices;
    this.argumentsProvider = argumentsProvider;
    this.d = debug('scanner');
    this.allDetectedComponents = undefined;
  }

  async scan(): Promise<ScanResult> {
    let scanStrategy = await this.scanStrategyDetector.detect();
    this.d(`Scan strategy: ${inspect(scanStrategy)}`);
    scanStrategy = await this.preprocessData(scanStrategy);
    this.d(`Scan strategy (after preprocessing): ${inspect(scanStrategy)}`);
    const scannerContext = this.scannerContextFactory(scanStrategy);
    const languagesAtPaths = await this.detectLanguagesAtPaths(scannerContext);
    this.d(`LanguagesAtPaths (${languagesAtPaths.length}):`, inspect(languagesAtPaths));
    const projectComponents = await this.detectProjectComponents(languagesAtPaths, scannerContext, scanStrategy);
    this.d(`Components (${projectComponents.length}):`, inspect(projectComponents));
    const practicesWithContext = await this.detectPractices(projectComponents);
    this.d(`Practices (${practicesWithContext.length}):`, inspect(practicesWithContext));
    await this.report(practicesWithContext);
    this.d(
      `Overall scan stats. LanguagesAtPaths: ${inspect(languagesAtPaths.length)}; Components: ${inspect(
        this.allDetectedComponents!.length,
      )}; Practices: ${inspect(practicesWithContext.length)}.`,
    );

    return { shouldExitOnEnd: this.shouldExitOnEnd };
  }

  /**
   * Initialize Scanner configuration
   */
  async init(): Promise<void> {
    const filePath = `/.dxscannerrc`;
    cli.action.start(`Initializing configuration: ${filePath}.yaml`);
    // check if .dxscannerrc.yaml already exists
    const fileExists: boolean = await this.fileSystemService.exists(`${filePath}`);
    const yamlExists: boolean = await this.fileSystemService.exists(`${filePath}.yaml`);
    const ymlExists: boolean = await this.fileSystemService.exists(`${filePath}.yml`);
    const jsonExists: boolean = await this.fileSystemService.exists(`${filePath}.json`);

    if (!yamlExists && !fileExists && !ymlExists && !jsonExists) {
      await this.createConfiguration();
    }
    cli.action.stop();
  }

  /**
   * Clone a repository if the input is remote repository
   */
  private async preprocessData(scanningStrategy: ScanningStrategy) {
    const { serviceType, accessType, remoteUrl } = scanningStrategy;
    let localPath = scanningStrategy.localPath;

    if (localPath === undefined && remoteUrl !== undefined && serviceType !== ServiceType.local) {
      const cloneUrl = new url.URL(remoteUrl);
      localPath = fs.mkdtempSync(path.join(os.tmpdir(), 'dx-scanner'));

      if (this.argumentsProvider.auth?.includes(':')) {
        cloneUrl.username = this.argumentsProvider.auth.split(':')[0];
        cloneUrl.password = this.argumentsProvider.auth.split(':')[1];
      } else if (this.argumentsProvider.auth) {
        cloneUrl.password = this.argumentsProvider.auth;
      }

      await git()
        .silent(true)
        .clone(cloneUrl.href, localPath);
    }

    return { serviceType, accessType, remoteUrl, localPath };
  }

  /**
   * Detect all languages
   */
  private async detectLanguagesAtPaths(context: ScannerContext) {
    let languagesAtPaths: LanguageAtPath[] = [];
    for (const languageDetector of context.languageDetectors) {
      languagesAtPaths = [...languagesAtPaths, ...(await languageDetector.detectLanguage())];
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
  private async report(practicesWithContext: PracticeWithContext[]): Promise<void> {
    const relevantPractices = practicesWithContext.map((p) => {
      const config = p.componentContext.configProvider.getOverriddenPractice(p.practice.getMetadata().id);
      const overridenImpact = config?.impact;

      return {
        component: p.componentContext.projectComponent,
        practice: { ...p.practice.getMetadata(), data: p.practice.data },
        evaluation: p.evaluation,
        overridenImpact: <PracticeImpact>(overridenImpact ? overridenImpact : p.practice.getMetadata().impact),
        isOn: p.isOn,
      };
    });

    this.d(`Reporters length: ${this.reporters.length}`);
    await Promise.all(this.reporters.map(async (r) => await r.report(relevantPractices)));

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
      let evaluation;
      try {
        evaluation = await practice.evaluate({ ...practiceContext, config: practiceConfig });
      } catch (error) {
        evaluation = PracticeEvaluationResult.unknown;
        const practiceDebug = debug('practices');
        practiceDebug(`The ${practice.getMetadata().name} practice failed with this error:\n${error}`);
      }

      const practiceWithContext = {
        practice,
        componentContext,
        practiceContext,
        evaluation,
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

      // do not scan only root path if found 0 components there
      if (componentsAtRootPath.length > 0) {
        relevantComponents = componentsAtRootPath;
      }
    }
    return relevantComponents;
  }

  private async createConfiguration() {
    let yamlInitContent = `# practices:`;
    // get Metadata and sort it alphabetically using id
    const sortedInitializedPractices = this.practices.sort((a, b) => a.getMetadata().id.localeCompare(b.getMetadata().id));
    for (const practice of sortedInitializedPractices) {
      const dataObject = practice.getMetadata();
      yamlInitContent += `\n#    ${dataObject.id}: ${dataObject.impact}`;
    }
    await this.fileSystemService.createFile(`/.dxscannerrc.yaml`, yamlInitContent);
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
  isOn: boolean;
}

export type ScanResult = {
  shouldExitOnEnd: boolean;
};
