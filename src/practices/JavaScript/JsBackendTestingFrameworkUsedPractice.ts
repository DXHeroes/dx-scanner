import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'JavaScript.BackendTestingFrameworkUsed',
  name: 'Using JS Backend Testing Framework',
  impact: PracticeImpact.high,
  suggestion:
    'Use a tests to point out the defects and errors that were made during the development phases. Jest and Mocha are the most widely used testing frameworks in the JavaScript community.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/unit-testing',
})
export class JsBackendTestingFrameworkUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      (ctx.projectComponent.language === ProgrammingLanguage.JavaScript ||
        ctx.projectComponent.language === ProgrammingLanguage.TypeScript) &&
      ctx.projectComponent.platform === ProjectComponentPlatform.BackEnd
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      if (ctx.packageInspector.hasOneOfPackages(['jest', 'mocha', 'jasmine', 'qunit'])) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}
