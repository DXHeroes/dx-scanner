import { CLIEngine } from 'eslint';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import _ from 'lodash';

@DxPractice({
  id: 'JavaScript.ESLintCorrectlyUsedPractice',
  name: 'Using ESLint Correctly',
  impact: PracticeImpact.medium,
  suggestion: 'Use the ESLint correctly. You have some errors.',
  reportOnlyOnce: true,
  url: 'https://eslint.org/',
  dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
})
export class ESLintCorrectlyUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    let options: CLIEngine.Options = {
      fix: false, // Use auto-fixer
      useEslintrc: false, // Set to false so the project doesn't take the eslint config from home folder
      rules: {
        semi: 2,
      },
    };

    // Get the eslint config for component
    const eslintConfig = await ctx.fileInspector.scanFor(/\.eslintrc/, ctx.projectComponent.path, { shallow: true });

    if (eslintConfig.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const baseConfig = require(eslintConfig[0].path);
      const plugins = _.clone(baseConfig.plugins);
      _.unset(baseConfig, 'plugins');
      _.unset(baseConfig, 'extends');
      options = { ...options, baseConfig, plugins };
    }

    const eslintIgnore = ctx.config && ctx.config.eslintIgnore;
    if (eslintIgnore !== undefined) {
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

    let cli, report;
    try {
      cli = new CLIEngine(options);
      report = cli.executeOnFiles([ctx.projectComponent.path]);
    } catch (error) {
      return PracticeEvaluationResult.unknown;
    }

    if (report['errorCount'] === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
