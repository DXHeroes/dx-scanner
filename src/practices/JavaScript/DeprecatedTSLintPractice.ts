import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'JavaScript.DeprecatedTSLint',
  name: 'Use a different linter',
  impact: PracticeImpact.medium,
  suggestion:
    'TSLint you use is deprecated. Use a different linter to catch dangerous code constructs. For example, ESLint - it is the most widely used linter in the JavaScript community.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
  dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
})
export class DeprecatedTSLintPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.TypeScript;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      const tslintRegex = new RegExp('tslint');
      if (ctx.packageInspector.hasPackage(tslintRegex)) {
        return PracticeEvaluationResult.notPracticing;
      }

      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.unknown;
  }
}
