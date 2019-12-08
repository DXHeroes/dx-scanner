import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { JavaDependenciesVersionMajorLevel } from './JavaDependenciesVersionMajorLevel';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';

@DxPractice({
  id: 'Java.DependenciesVersionMinorPatchLevel',
  name: 'Update Dependencies of Minor and Patch Level',
  impact: PracticeImpact.high,
  suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Use, for example, Renovate Bot.',
  reportOnlyOnce: true,
  url: 'https://renovatebot.com/',
})
export class JavaDependenciesVersionMinorPatchLevel extends JavaDependenciesVersionMajorLevel implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined || ctx.packageInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;
    if (pkgs === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const result = await JavaDependenciesVersionMajorLevel.searchMavenCentral(pkgs, 5);

    const patchLevel = JavaDependenciesVersionMajorLevel.isPracticing(result, SemverLevel.patch, pkgs);
    const minorLevel = JavaDependenciesVersionMajorLevel.isPracticing(result, SemverLevel.minor, pkgs);

    if (patchLevel === PracticeEvaluationResult.notPracticing || minorLevel === PracticeEvaluationResult.notPracticing) {
      return PracticeEvaluationResult.notPracticing;
    }

    return PracticeEvaluationResult.practicing;
  }
}
