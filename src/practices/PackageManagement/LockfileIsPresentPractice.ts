import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.LockfileIsPresent',
  name: 'Have a Lockfile',
  impact: PracticeImpact.high,
  suggestion: 'Commit lockfile to git to have reliable assmebly across developers and environments',
  reportOnlyOnce: true,
  url: 'https://www.npmjs.com/package/lockfile',
})
export class LockfileIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regexLockFile = new RegExp('lock', 'i');

    const files = await ctx.fileInspector.scanFor(regexLockFile, '/', { shallow: true });
    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
