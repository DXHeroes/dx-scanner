import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'JavaScript.ESLintUsed',
  name: 'ESLintUsed',
  impact: PracticeImpact.medium,
  suggestion: 'Use a linter to catch dangerous code constructs. ESLint is the most widely used linter in the JavaScript community.',
  reportOnlyOnce: true,
  url: 'https://eslint.org/',
})
export class ESLintUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      if (ctx.packageInspector.hasPackage('eslint')) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}
