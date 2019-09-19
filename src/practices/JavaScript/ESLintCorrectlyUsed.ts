import eslint, { CLIEngine } from 'eslint';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { ConfigProvider } from '../../contexts/ConfigProvider';
import { inject } from 'inversify';
import { Types } from '../../types';

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
    const CLIEngine = eslint.CLIEngine;

    const options: CLIEngine.Options = {
      //Set to false so the project doesn't take the eslint config from home folder
      useEslintrc: false,
      rules: {
        semi: 2,
      },
    };

    let eslintConfig;
    //Get the eslint config for component
    if (ctx.fileInspector !== undefined) {
      const eslintConfigNameRegex = new RegExp('.eslintrc');
      eslintConfig = await ctx.fileInspector.scanFor(eslintConfigNameRegex, ctx.projectComponent.path, { shallow: true });
    }
    if (eslintConfig) {
      Object.assign(options, { configFile: eslintConfig[0].path });
    }

    const eslintIgnore = ctx.config && ctx.config.eslintIgnore;
    console.log(eslintConfig, 'config');
    console.log(eslintIgnore, 'ignore');
    if (eslintIgnore !== undefined) {
      Object.assign(options, { ignorePattern: eslintIgnore });
    }
    if (ctx.projectComponent.language === ProgrammingLanguage.TypeScript) {
      Object.assign(options, { extensions: ['.ts'] });
    }
    if (ctx.projectComponent.language === ProgrammingLanguage.JavaScript) {
      Object.assign(options, { extensions: ['.js'] });
    }

    const cli = new CLIEngine(options);

    const report = cli.executeOnFiles([ctx.projectComponent.path]);

    if (report['errorCount'] === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
