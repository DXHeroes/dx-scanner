import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'CSharp.LinterUsedPractice',
  name: 'Use a C# Linter',
  impact: PracticeImpact.medium,
  suggestion: 'Use Linter to catch dangerous code constructs.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
})
export class CSharpLinterUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.CSharp;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      if (ctx.packageInspector.hasOneOfPackages(['golang.org/x/lint', 'github.com/golangci/golangci-lint'])) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}
