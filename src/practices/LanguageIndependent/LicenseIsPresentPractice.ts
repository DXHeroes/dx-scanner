import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.LicenseIsPresent',
  name: 'Create a License File',
  impact: PracticeImpact.medium,
  suggestion: 'Add a license to your repository to let others know what they can and can not do with your code.',
  reportOnlyOnce: true,
  url: 'https://choosealicense.com/licenses/',
})
export class LicenseIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regexLicense = new RegExp('license', 'i');

    const files = await ctx.fileInspector.scanFor(regexLicense, '/', { shallow: true });
    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
