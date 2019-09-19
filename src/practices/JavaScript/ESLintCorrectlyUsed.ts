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
    let options: CLIEngine.Options = {
      fix: false, // Use auto-fixer
      useEslintrc: false, // Set to false so the project doesn't take the eslint config from home folder
      rules: {
        semi: 2,
      },
    };

    let eslintConfig;
    // Get the eslint config for component
    // FIXME: this is not correct behaviour - if there is no fileInspector, it should be unknown practicing
    if (ctx.fileInspector !== undefined) {
      eslintConfig = await ctx.fileInspector.scanFor(/\.eslintrc/, ctx.projectComponent.path, { shallow: true });
    }
    if (eslintConfig) {
      // options = { ...options, configFile: eslintConfig[0].path };
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const baseConfig = require(eslintConfig[0].path);
      const plugins = _.clone(baseConfig.plugins);
      const extensions = _.clone(baseConfig.extends);
      // baseConfig.delete("plugins")
      _.unset(baseConfig, 'plugins');
      _.unset(baseConfig, 'extends');
      options = { ...options, baseConfig, plugins, extensions };
      // console.log(require(eslintConfig[0].path))
    }

    const eslintIgnore = ctx.config && ctx.config.eslintIgnore;
    if (eslintIgnore !== undefined) {
      options = { ...options, ignorePattern: eslintIgnore };
    } else {
      options = { ...options, ignorePattern: ['lib', 'dist', 'build'] };
    }

    if (ctx.projectComponent.language === ProgrammingLanguage.TypeScript) {
      // Object.assign(options, { extensions: ['.ts'] });
      options = { ...options, extensions: ['.ts'] };
    }
    if (ctx.projectComponent.language === ProgrammingLanguage.JavaScript) {
      options = { ...options, extensions: ['.js'] };
    }

    const cli = new CLIEngine(options);

    const report = cli.executeOnFiles([ctx.projectComponent.path]);

    // console.log('report :', JSON.stringify(report.results.filter((r) => r.errorCount > 0)));
    if (report['errorCount'] === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
