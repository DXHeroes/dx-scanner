import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { DependenciesVersionMajorLevel } from './DependenciesVersionMajorLevel';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';

@DxPractice({
  id: 'LanguageIndependent.DependenciesVersionMinorPatchLevel',
  name: 'Update Dependencies of Minor or Patch Level',
  impact: PracticeImpact.high,
  suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Use, for example, Renovate Bot.',
  reportOnlyOnce: true,
  url: 'https://renovatebot.com/',
})
export class DependenciesVersionMinorPatchLevel extends DependenciesVersionMajorLevel implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined || ctx.packageInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;
    const result = await DependenciesVersionMajorLevel.runNcu(pkgs);

    const patchLevel = DependenciesVersionMajorLevel.isPracticing(result, SemverLevel.patch, ctx);
    const minorLevel = DependenciesVersionMajorLevel.isPracticing(result, SemverLevel.minor, ctx);

    if (patchLevel === PracticeEvaluationResult.notPracticing || minorLevel === PracticeEvaluationResult.notPracticing) {
      return PracticeEvaluationResult.notPracticing;
    }
    return PracticeEvaluationResult.practicing;
  }
}
