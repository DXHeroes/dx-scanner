import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.GitignoreIsPresent',
  name: 'Create a .gitignore',
  impact: PracticeImpact.high,
  suggestion:
    'Add .gitignore to your directory. .gitignore allows you to ignore files, such as editor backup files, build products or local configuration overrides that you never want to commit into a repository.',
  reportOnlyOnce: true,
  url: 'https://git-scm.com/docs/gitignore',
})
export class GitignoreIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexGitignore = new RegExp('.gitignore', 'i');

    const files = await ctx.fileInspector.scanFor(regexGitignore, '/', { shallow: true });
    const rootFiles = await ctx.root.fileInspector.scanFor(regexGitignore, '/', { shallow: true });

    if (files.length > 0 || rootFiles.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
