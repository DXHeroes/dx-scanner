import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.CIUsedPractice',
  name: 'Using Continuous Integration',
  impact: PracticeImpact.high,
  suggestion:
    'Continuous Integration (CI) is a practice of daily integrating code changes. Use CI to reduce the integration risk, improve code quality and more.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/continuous-integration',
})
export class CIUsedPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regexCI = new RegExp(/\.gitlab-ci\.yml|\.travis\.yml|\.jenkins\.yml|\.circle-ci\/config\.yml|appveyor\.yml/, 'i');

    const files = await ctx.fileInspector.scanFor(regexCI, '/', { shallow: true });

    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
