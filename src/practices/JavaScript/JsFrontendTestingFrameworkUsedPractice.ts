import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'JavaScript.FrontendTestingFrameworkUsed',
  name: 'Use JS Frontend Testing Framework',
  impact: PracticeImpact.medium,
  suggestion:
    'Use tests to point out defects and errors that were made during the development phases. Use, for example, Jest - it is the most widely used testing framework in the JavaScript community.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/tags/testing',
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
