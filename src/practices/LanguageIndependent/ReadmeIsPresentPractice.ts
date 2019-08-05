import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.ReadmeIsPresent',
  name: 'Having a Readme file',
  impact: PracticeImpact.high,
  suggestion: 'Add Readme to tell other people why your project is useful, what they can do with your project, and how they can use it.',
  reportOnlyOnce: true,
  url: 'https://readme.io/',
})
export class ReadmeIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regexLReadme = new RegExp('readme', 'i');

    const files = await ctx.fileInspector.scanFor(regexLReadme, '/', { shallow: true });
    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
