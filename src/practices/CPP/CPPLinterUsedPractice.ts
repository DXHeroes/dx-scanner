import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'CPP.LinterUsedPractice',
  name: 'Use a C++ Linter',
  impact: PracticeImpact.medium,
  suggestion: 'Use Linter to catch bugs and dangerous code constructs.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
})
export class CPPLinterUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.CPlusPlus;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      if (ctx.packageInspector.hasOneOfPackages(['cppcheck.sourceforge.net/', 'github.com/oclint/oclint'])) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}
