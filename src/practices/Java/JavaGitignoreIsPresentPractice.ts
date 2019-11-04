import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.GitignoreIsPresent',
  name: 'Having a .gitignore',
  impact: PracticeImpact.high,
  suggestion:
    'Add gitignore which allow you to ignore files, such as editor backup files, build products or local configuration overrides that you never want to commit into a repository.',
  reportOnlyOnce: true,
  url: 'https://git-scm.com/docs/gitignore',
})
export class JavaGitignoreIsPresentPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regexGitignore = new RegExp('.gitignore', 'i');

    const files = await ctx.fileInspector.scanFor(regexGitignore, '/', { shallow: true });
    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
