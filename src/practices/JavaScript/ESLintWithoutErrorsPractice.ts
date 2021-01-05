import debug from 'debug';
import { ESLint } from 'eslint';
import yaml from 'js-yaml';
import _ from 'lodash';
import * as nodePath from 'path';
import shell from 'shelljs';
import { FixerContext } from '../../contexts/fixer/FixerContext';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { LinterIssueDto, LinterIssueSeverity } from '../../reporters';
import { PracticeConfig } from '../../scanner/IConfigProvider';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';
import { PackageManagerType, PackageManagerUtils } from '../utils/PackageManagerUtils';

interface PracticeOverride extends PracticeConfig {
  override: {
    lintFilesPatterns: string[];
    ignorePatterns: string[];
  };
}

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
      return PracticeEvaluationResult.unknown;
    }

    let ignorePatterns = ['lib', 'build', 'dist'];
    let lintFilesPatterns = [`${ctx.projectComponent.path}`];
    if (ctx.config) {
      const config = <PracticeOverride>ctx.config;

      ignorePatterns = config.override?.ignorePatterns.length === 0 ? ignorePatterns : config.override?.ignorePatterns;

      // get absolute paths for lint files patterns
      const lintFilesPatternsOverride = config.override?.lintFilesPatterns.map((pattern) => {
        return `${ctx.projectComponent.path}/${pattern}`;
      });
      lintFilesPatterns = _.merge(lintFilesPatterns, lintFilesPatternsOverride);
    }
    const securityVulnerabilitiesPracticeDebug = debug('ESLintWithoutErrorsPractice');

    // Get the eslint config and ignore for a component.
    const eslintConfig = await ctx.fileInspector.scanFor(/\.eslintrc/, '/', { shallow: true });
    const eslintIgnore = await ctx.fileInspector.scanFor(/\.eslintignore/, '/', { shallow: true });

    let options: ESLint.Options = {
      fix, // Use auto-fixer.
      useEslintrc: false, // Set to false so the project doesn't take the eslint config from home folder.
      errorOnUnmatchedPattern: true,
    };

    if (eslintConfig.length > 0) {
      let baseConfig, content;
      const packageManager = await PackageManagerUtils.getPackageManagerInstalled(ctx.fileInspector);

      if (packageManager === PackageManagerType.unknown) {
        securityVulnerabilitiesPracticeDebug(
          'Cannot establish package-manager type, missing package-lock.json and yarn.lock or npm command not installed.',
        );
        this.setData([]);
        return PracticeEvaluationResult.unknown;
      }

      shell.cd(ctx.fileInspector?.basePath);

      const npmCmd = 'npm install';
      const yarnCmd = 'yarn install';

      if (packageManager === PackageManagerType.yarn) {
        shell.exec(yarnCmd, { silent: true });
      }

      if (packageManager === PackageManagerType.npm) {
        shell.exec(npmCmd, { silent: true });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        baseConfig = require(nodePath.resolve(ctx.fileInspector.basePath!, eslintConfig[0].path));
        const plugins = _.clone(baseConfig.plugins);

        _.unset(baseConfig, 'plugins');
        _.unset(baseConfig, 'extends');
        options = {
          ...options,
          baseConfig,
          overrideConfig: { plugins, ignorePatterns },
          overrideConfigFile: eslintConfig[0].path,
          resolvePluginsRelativeTo: `${ctx.fileInspector.basePath}/node_modules`,
        };
      } catch (error) {
        const eSLintWithoutErrorsPracticeDebug = debug('ESLintWithoutErrorsPractice');
        eSLintWithoutErrorsPracticeDebug(`Loading .eslintrc file failed with this error: ${error.stack}`);

        content = await ctx.fileInspector.readFile(eslintConfig[0].path);
        baseConfig = yaml.load(content);
      }
    }

    if (eslintIgnore.length > 0) {
      options = { ...options, ignorePath: eslintIgnore[0].path };
    }

    if (ctx.projectComponent.language === ProgrammingLanguage.TypeScript) {
      options = { ...options, extensions: ['.ts'] };
    }
    if (ctx.projectComponent.language === ProgrammingLanguage.JavaScript) {
      options = { ...options, extensions: ['.js'] };
    }

    const cli = new ESLint(options);

    return cli.lintFiles(lintFilesPatterns);
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const report = await this.runEslint(ctx);
    if (!report || report === PracticeEvaluationResult.unknown) {
      return PracticeEvaluationResult.unknown;
    }

    const linterIssues: LinterIssueDto[] = [];
    let errorCount = 0;
    for (const result of report) {
      if (result.errorCount > 0 || result.warningCount > 0) {
        for (const message of result.messages) {
          errorCount += result.errorCount;

          linterIssues.push({
            filePath: `${result.filePath}(${message.line})(${message.column})`,
            severity: message.severity === 2 ? LinterIssueSeverity.Error : LinterIssueSeverity.Warning,
            url: `${result.filePath}#L${message.line}`,
            type: message.message,
          });
        }
      }
    }
    this.setData(linterIssues);

    if (errorCount === 0) {
      return PracticeEvaluationResult.practicing;
    }
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    await this.runEslint(ctx, { fix: true });
  }

  setData(linterIssues: LinterIssueDto[]): void {
    this.data.statistics = { linterIssues };
  }
}
