import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { DependenciesVersionMajorLevelPractice } from './DependenciesVersionMajorLevel';
import { DependenciesVersionEvaluationUtils, PkgToUpdate } from '../utils/DependenciesVersionEvaluationUtils';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { flatten } from 'lodash';
import ncu from 'npm-check-updates';

@DxPractice({
  id: 'JavaScript.DependenciesVersionMinorPatchLevel',
  name: 'Update Dependencies of Minor and Patch Level',
  impact: PracticeImpact.high,
  suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Use, for example, npm-check-updates.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/updating-the-dependencies',
})
export class DependenciesVersionMinorPatchLevelPractice extends DependenciesVersionMajorLevelPractice implements IPractice {
  private patchLevelPkgs: PkgToUpdate[] = [];
  private minorLevelPkgs: PkgToUpdate[] = [];

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.packageInspector || !ctx.packageInspector.packages) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;

    const result = await this.runNcu(pkgs);

    const patchLevelPkgs = DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, SemverLevel.patch, pkgs);
    const minorLevelPkgs = DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, SemverLevel.minor, pkgs);
    this.patchLevelPkgs = patchLevelPkgs;
    this.minorLevelPkgs = minorLevelPkgs;
    this.setData(flatten([patchLevelPkgs, minorLevelPkgs]));

    if (patchLevelPkgs.length > 0 || minorLevelPkgs.length > 0) {
      return PracticeEvaluationResult.notPracticing;
    }
    return PracticeEvaluationResult.practicing;
  }

  async fix() {
    const packagesToUpdate = this.patchLevelPkgs
      .map((p) => p.name)
      .concat(this.minorLevelPkgs.map((p) => p.name))
      .join(',');
    await ncu.run({ filter: packagesToUpdate, upgrade: true });
  }
}
