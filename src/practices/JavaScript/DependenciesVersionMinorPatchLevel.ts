import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { DependenciesVersionMajorLevelPractice } from './DependenciesVersionMajorLevel';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { flatten } from 'lodash';

@DxPractice({
  id: 'JavaScript.DependenciesVersionMinorPatchLevel',
  name: 'Update Dependencies of Minor and Patch Level',
  impact: PracticeImpact.high,
  suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Use, for example, npm-check-updates.',
  reportOnlyOnce: true,
  url: 'https://github.com/tjunnone/npm-check-updates',
})
export class DependenciesVersionMinorPatchLevelPractice extends DependenciesVersionMajorLevelPractice implements IPractice {
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

    const patchLevelPkgs = this.packagesToBeUpdated(result, SemverLevel.patch, pkgs);
    const minorLevelPkgs = this.packagesToBeUpdated(result, SemverLevel.minor, pkgs);
    this.setData(flatten([patchLevelPkgs, minorLevelPkgs]));

    if (patchLevelPkgs.length > 0 || minorLevelPkgs.length > 0) {
      return PracticeEvaluationResult.notPracticing;
    }
    return PracticeEvaluationResult.practicing;
  }
}
