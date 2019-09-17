import eslint from 'eslint';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'JavaScript.ESLintCorrectlyUsed',
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
    let cli;

    if (ctx.projectComponent.language === ProgrammingLanguage.TypeScript) {
      cli = new CLIEngine({
        //extensions: ['.ts'],
        useEslintrc: true,
        ignorePattern: ['/lib'],
        rules: {
          semi: 2,
        },
      });
    } else {
      cli = new CLIEngine({
        extensions: ['.js'],
        useEslintrc: true,
        ignorePattern: ['/lib'],
        rules: {
          semi: 2,
        },
      });
    }

    const report = cli.executeOnFiles([ctx.projectComponent.path]);
    console.log(report);

    if (report['errorCount'] === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
