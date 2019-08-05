import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.EditorConfigIsPresent',
  name: 'Having an .editorconfig',
  impact: PracticeImpact.small,
  suggestion: 'Add .editorconfig to define and maintain consistent coding styles between different editors and IDEs.',
  reportOnlyOnce: true,
  url: 'https://editorconfig.org/',
})
export class EditorConfigIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regexGitignore = new RegExp('.editorconfig', 'i');

    const files = await ctx.fileInspector.scanFor(regexGitignore, '/', { shallow: true });
    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
