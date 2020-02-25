import debug from 'debug';
import { CLIEngine } from 'eslint';
import yaml from 'js-yaml';
import _ from 'lodash';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import * as nodePath from 'path';
import { FixerContext } from '../../contexts/fixer/FixerContext';

@DxPractice({
  id: 'JavaScript.ESLintWithoutErrorsPractice',
  name: 'ESLint Without Errors',
  impact: PracticeImpact.medium,
  suggestion: 'Use the ESLint correctly. You have some errors.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
  dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
})
export class ESLintWithoutErrorsPractice implements IPractice {
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

    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    await this.runEslint(ctx, { fix: true });
  }
}
