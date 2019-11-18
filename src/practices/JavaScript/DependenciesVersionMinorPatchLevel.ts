import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { evaluateBySemverLevel, SemverVersion } from '../../detectors/utils';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'LanguageIndependent.DependenciesVersionMinorPatchLevel',
  name: 'Update Dependencies of Minor or Patch Level',
  impact: PracticeImpact.high,
  suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Use, for example, Renovate Bot.',
  reportOnlyOnce: true,
  url: 'https://renovatebot.com/',
})
export class DependenciesVersionMinorPatchLevel implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const minor = await evaluateBySemverLevel(ctx, SemverVersion.minor);
    const patch = await evaluateBySemverLevel(ctx, SemverVersion.patch);
    if (patch === PracticeEvaluationResult.notPracticing || minor === PracticeEvaluationResult.notPracticing) {
      return PracticeEvaluationResult.notPracticing;
    }
    return PracticeEvaluationResult.practicing;
  }
}
