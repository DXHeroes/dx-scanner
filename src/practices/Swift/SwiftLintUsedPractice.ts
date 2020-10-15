import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'Swift.SwiftLintUsed',
  name: 'Use SwiftLint',
  impact: PracticeImpact.medium,
  suggestion: 'Use Linter to catch dangerous code constructs. SwiftLint is the most widely used Linter in the Swift community.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
})
export class SwiftLintUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.Swift
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      const swiftlintRegex = new RegExp('swiftlint');
      if (ctx.packageInspector.hasPackage(swiftlintRegex)) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}