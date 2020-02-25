import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'JavaScript.ESLintUsed',
  name: 'Use ESLint',
  impact: PracticeImpact.medium,
  suggestion: 'Use Linter to catch dangerous code constructs. ESLint is the most widely used Linter in the JavaScript community.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
})
export class ESLintUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      const eslintRegex = new RegExp('eslint');
      if (ctx.packageInspector.hasPackage(eslintRegex)) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}
