import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.EditorConfigIsPresent',
  name: 'Use .editorconfig',
  impact: PracticeImpact.small,
  suggestion: 'Add .editorconfig to your repository to define and maintain consistent coding styles between different editions and IDEs.',
  reportOnlyOnce: true,
  url: 'https://editorconfig.org/',
})
export class EditorConfigIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexEditorcfg = new RegExp('.editorconfig', 'i');

    const files = await ctx.fileInspector.scanFor(regexEditorcfg, '/', { shallow: true });
    const rootFiles = await ctx.root.fileInspector.scanFor(regexEditorcfg, '/', { shallow: true });
    if (files.length > 0 || rootFiles.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
