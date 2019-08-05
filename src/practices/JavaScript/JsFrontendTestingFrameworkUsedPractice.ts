import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'JavaScript.FrontendTestingFrameworkUsed',
  name: 'Using JS Frontend Testing Framework',
  impact: PracticeImpact.medium,
  suggestion:
    'Use a tests to catch to point out the defects and errors that were made during the development phases. Jest is the most widely used testing framework in the JavaScript community.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/unit-testing',
})
export class JsFrontendTestingFrameworkUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      (ctx.projectComponent.language === ProgrammingLanguage.JavaScript ||
        ctx.projectComponent.language === ProgrammingLanguage.TypeScript) &&
      ctx.projectComponent.platform === ProjectComponentPlatform.FrontEnd
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      if (ctx.packageInspector.hasOneOfPackages(['jest', 'mocha', 'jasmine'])) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}
