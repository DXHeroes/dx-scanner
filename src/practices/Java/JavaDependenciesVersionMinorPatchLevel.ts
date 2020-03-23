import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { JavaDependenciesVersionMajorLevel } from './JavaDependenciesVersionMajorLevel';
import { DependenciesVersionEvaluationUtils } from '../utils/DependenciesVersionEvaluationUtils';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { flatten } from 'lodash';

@DxPractice({
  id: 'Java.DependenciesVersionMinorPatchLevel',
  name: 'Update Dependencies of Minor and Patch Level',
  impact: PracticeImpact.high,
  suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, versions-maven-plugin',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/updating-the-dependencies',
  dependsOn: { practicing: ['Java.SpecifiedDependencyVersions'] },
})
export class JavaDependenciesVersionMinorPatchLevel extends JavaDependenciesVersionMajorLevel implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.packageInspector || !ctx.packageInspector.packages) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;

    const result = await JavaDependenciesVersionMajorLevel.searchMavenCentral(pkgs, 5);

    const patchLevelPkgs = DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, SemverLevel.patch, pkgs);
    const minorLevelPkgs = DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, SemverLevel.minor, pkgs);
    this.setData(flatten([patchLevelPkgs, minorLevelPkgs]));

    if (patchLevelPkgs.length > 0 || minorLevelPkgs.length > 0) {
      return PracticeEvaluationResult.notPracticing;
    }
    return PracticeEvaluationResult.practicing;
  }
}
