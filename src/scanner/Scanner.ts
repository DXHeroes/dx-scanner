import { injectable, inject, multiInject } from 'inversify';
import { ScanningStrategyDetector, ScanningStrategy, ServiceType } from '../detectors/ScanningStrategyDetector';
import { Types, ScannerContextFactory } from '../types';
import {
  LanguageAtPath,
  ProjectComponent,
  PracticeEvaluationResult,
  ProjectComponentFramework,
  ProjectComponentPlatform,
  ProjectComponentType,
} from '../model';
import { ScannerContext } from '../contexts/scanner/ScannerContext';
import { LanguageContext } from '../contexts/language/LanguageContext';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import { IReporter } from '../reporters/IReporter';
import debug from 'debug';
import fs from 'fs';
import git from 'simple-git/promise';
import os from 'os';
import path from 'path';
import url from 'url';
import { inspect } from 'util';
import { ScannerUtils } from './ScannerUtils';
import { ArgumentsProvider } from '../inversify.config';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import filterAsync from 'node-filter-async';

@injectable()
export class Scanner {
  private readonly scanStrategyDetector: ScanningStrategyDetector;
  private readonly scannerContextFactory: ScannerContextFactory;
  private readonly reporter: IReporter;
  private readonly practices: IPracticeWithMetadata[];
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly scanDebug: debug.Debugger;

  constructor(
    @inject(ScanningStrategyDetector) scanStrategyDetector: ScanningStrategyDetector,
    @inject(Types.ScannerContextFactory) scannerContextFactory: ScannerContextFactory,
    @inject(Types.IReporter) reporter: IReporter,
    // inject all practices registered under Types.Practice in inversify config
    @multiInject(Types.Practice) practices: IPracticeWithMetadata[],
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
  ) {
    this.scanStrategyDetector = scanStrategyDetector;
    this.scannerContextFactory = scannerContextFactory;
    this.reporter = reporter;
    this.practices = practices;
    this.argumentsProvider = argumentsProvider;
    this.scanDebug = debug('scanner');
  }

  async scan(): Promise<void> {
    let scanStrategy = await this.scanStrategyDetector.detect();
    this.scanDebug(`Scan strategy: ${inspect(scanStrategy)}`);
    scanStrategy = await this.preprocessData(scanStrategy);
    this.scanDebug(`Scan strategy (after preprocessing): ${inspect(scanStrategy)}`);
    const scannerContext = this.scannerContextFactory(scanStrategy);
    const languagesAtPaths = await this.detectLanguagesAtPaths(scannerContext);
    this.scanDebug(`LanguagesAtPaths:`, inspect(languagesAtPaths));
    const projectComponents = await this.detectProjectComponents(languagesAtPaths, scannerContext, scanStrategy);
    this.scanDebug(`Components:`, inspect(projectComponents));
    const identifiedPractices = await this.detectPractices(projectComponents);
    await this.report(identifiedPractices);
  }

  private async preprocessData(scanningStrategy: ScanningStrategy) {
    const { serviceType, accessType, remoteUrl } = scanningStrategy;
    let localPath = scanningStrategy.localPath;

    if (localPath === undefined && remoteUrl !== undefined) {
      switch (serviceType) {
        case ServiceType.git:
        case ServiceType.github:
          const cloneUrl = new url.URL(remoteUrl);
          localPath = fs.mkdtempSync(path.join(os.tmpdir(), 'dx-scanner'));
          await git()
            .silent(true)
            .clone(cloneUrl.href, localPath);
          break;
      }
    }

    return { serviceType, accessType, remoteUrl, localPath };
  }

  private async detectLanguagesAtPaths(context: ScannerContext) {
    let languagesAtPaths: LanguageAtPath[] = [];
    for (const languageDetector of context.languageDetectors) {
      languagesAtPaths = [...languagesAtPaths, ...(await languageDetector.detectLanguage())];
    }
    return languagesAtPaths;
  }

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
    return components;
  }

  private async detectPractices(componentsWithContext: ProjectComponentAndLangContext[]): Promise<PracticeWithContext[]> {
    const practicesWithContext: PracticeWithContext[] = [];
    for (const componentWithCtx of componentsWithContext) {
      const componentContext = componentWithCtx.languageContext.getProjectComponentContext(componentWithCtx.component);
      const practiceContext = componentContext.getPracticeContext();

      const applicablePractices = await filterAsync(this.practices, async (p) => {
        return await p.isApplicable(practiceContext);
      });

      const orderedApplicablePractices = ScannerUtils.sortPractices(applicablePractices);
      for (const practice of orderedApplicablePractices) {
        const isFulfilled = ScannerUtils.isFulfilled(practice, practicesWithContext);
        if (!isFulfilled) continue;

        const evaluation = await practice.evaluate(practiceContext);
        practicesWithContext.push({
          practice,
          componentContext,
          practiceContext,
          evaluation,
        });
      }
    }
    this.scanDebug('Applicable practices:');
    this.scanDebug(practicesWithContext.map((p) => p.practice.getMetadata().name));
    return practicesWithContext;
  }

  private async report(practicesWithContext: PracticeWithContext[]) {
    const relevantPractices = practicesWithContext.filter((p) => p.evaluation === PracticeEvaluationResult.notPracticing);
    const reportString = this.reporter.report(
      relevantPractices.map((p) => {
        return {
          practice: p.practice.getMetadata(),
          component: p.componentContext.projectComponent,
        };
      }),
    );
    console.log(reportString);
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
}
