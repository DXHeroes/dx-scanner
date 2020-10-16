import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.ChangelogIsPresent',
  name: 'Create a Changelog File',
  impact: PracticeImpact.high,
  suggestion:
    'Add a Changelog file to tell other people what changed in the last release.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/changelog',
})
export class ChangelogIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexChangelog = new RegExp('changelog', 'i');

    const files = await ctx.fileInspector.scanFor(regexChangelog, '/', { shallow: true });
    const rootFiles = await ctx.root.fileInspector.scanFor(regexChangelog, '/', { shallow: true });
    if (files.length > 0 || rootFiles.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
