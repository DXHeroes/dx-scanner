import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'JavaScript.DeprecatedTSLint',
  name: 'Using TSLint',
  impact: PracticeImpact.medium,
  suggestion:
    'TS Lint is deprecated. Use a linter to catch dangerous code constructs. ESLint is the most widely used linter in the JavaScript community.',
  reportOnlyOnce: true,
  url: 'https://medium.com/palantir/tslint-in-2019-1a144c2317a9',
  dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
})
export class DeprecatedTSLintPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.TypeScript;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      if (ctx.packageInspector.hasPackage('tslint')) {
        return PracticeEvaluationResult.notPracticing;
      }
    }

    return PracticeEvaluationResult.unknown;
  }
}
