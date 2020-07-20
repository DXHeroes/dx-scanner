import debug from 'debug';
import { CLIEngine } from 'eslint';
import yaml from 'js-yaml';
import _ from 'lodash';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import * as nodePath from 'path';
import { FixerContext } from '../../contexts/fixer/FixerContext';
import { PracticeBase } from '../PracticeBase';
import { LinterIssueDto, LinterIssueSeverity } from '../../reporters';
import { GitServiceUtils } from '../../services';
import { ServiceType } from '../../detectors/IScanningStrategy';
import { ScanningStrategy } from '../../detectors';
import { config } from 'cli-ux';
import { ScanningStrategyDetectorUtils } from '../../detectors/utils/ScanningStrategyDetectorUtils';

@DxPractice({
  id: 'JavaScript.ESLintWithoutErrorsPractice',
  name: 'ESLint Without Errors',
  impact: PracticeImpact.medium,
  suggestion: 'Use the ESLint correctly. You have some errors.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
  dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
})
export class ESLintWithoutErrorsPractice extends PracticeBase {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  private async runEslint(ctx: PracticeContext, { fix } = { fix: false }) {
    if (!ctx.fileInspector) {
      return;
    }
    let options: CLIEngine.Options = {
      fix, // Use auto-fixer.
      useEslintrc: false, // Set to false so the project doesn't take the eslint config from home folder.
      rules: {
        semi: 2,
      },
    };

    // Get the eslint config for component.
    const eslintConfig = await ctx.fileInspector.scanFor(/\.eslintrc/, '/', { shallow: true });

    if (eslintConfig.length > 0) {
      let baseConfig, content;

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        baseConfig = require(nodePath.resolve(ctx.fileInspector.basePath!, eslintConfig[0].path));

        const plugins = _.clone(baseConfig.plugins);
        _.unset(baseConfig, 'plugins');
        _.unset(baseConfig, 'extends');
        options = { ...options, baseConfig, plugins };
      } catch (error) {
        const eSLintWithoutErrorsPracticeDebug = debug('ESLintWithoutErrorsPractice');
        eSLintWithoutErrorsPracticeDebug(`Loading .eslintrc file failed with this error: ${error.stack}`);

        content = await ctx.fileInspector.readFile(eslintConfig[0].path);
        baseConfig = yaml.safeLoad(content);
      }
    }

    let eslintIgnore;
    if (typeof ctx.config !== 'string') {
      eslintIgnore = ctx.config && ctx.config.eslintIgnore;
    }
    if (eslintIgnore && eslintIgnore.length > 0) {
      options = { ...options, ignorePattern: eslintIgnore };
    } else {
      options = { ...options, ignorePattern: ['lib', 'dist', 'build'] };
    }

    if (ctx.projectComponent.language === ProgrammingLanguage.TypeScript) {
      options = { ...options, extensions: ['.ts'] };
    }
    if (ctx.projectComponent.language === ProgrammingLanguage.JavaScript) {
      options = { ...options, extensions: ['.js'] };
    }

    const cli = new CLIEngine(options);
    return cli.executeOnFiles([ctx.projectComponent.path]);
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const report = await this.runEslint(ctx);
    if (!report) {
      return PracticeEvaluationResult.unknown;
    }

    if (report['errorCount'] === 0) {
      return PracticeEvaluationResult.practicing;
    }

    const linterIssues: LinterIssueDto[] = [];

    //TODO: resolve file path
    let serviceType: ServiceType = ServiceType.local;
    if (ctx.projectComponent.repositoryPath) {
      //gitLab
      if (ScanningStrategyDetectorUtils.isGitLabPath(ctx.projectComponent.repositoryPath)) {
        serviceType = ServiceType.gitlab;
      }
      //gitHub
      if (ScanningStrategyDetectorUtils.isGitHubPath(ctx.projectComponent.repositoryPath)) {
        serviceType = ServiceType.github;
      }
      //bitBusket
      if (ScanningStrategyDetectorUtils.isBitbucketPath(ctx.projectComponent.repositoryPath)) {
        serviceType = ServiceType.bitbucket;
      }
    }

    for (const result of report.results) {
      if (result.errorCount > 0 || result.warningCount > 0) {
        const url =
          serviceType === ServiceType.local
            ? result.filePath
            : GitServiceUtils.getUrlToRepo(
                ctx.projectComponent.repositoryPath!,
                <ScanningStrategy>{ serviceType },
                result.filePath.replace(ctx.projectComponent.path, ''),
              );
        for (const message of result.messages) {
          linterIssues.push({
            filePath: `${result.filePath}(${message.line})(${message.column})`,
            severity: message.severity === 2 ? LinterIssueSeverity.Error : LinterIssueSeverity.Warning,
            url,
            type: message.message,
          });
        }
      }
    }
    this.setData(linterIssues);
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    await this.runEslint(ctx, { fix: true });
  }

  setData(linterIssues: LinterIssueDto[]): void {
    this.data.statistics = { linterIssues };
  }
}
