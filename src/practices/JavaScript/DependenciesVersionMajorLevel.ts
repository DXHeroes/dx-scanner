import ncu from 'npm-check-updates';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { PackageInspectorBase, SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';

@DxPractice({
  id: 'JavaScript.DependenciesVersionMajorLevel',
  name: 'Update Dependencies of Major Level',
  impact: PracticeImpact.small,
  suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, Renovate Bot.',
  reportOnlyOnce: true,
  url: 'https://renovatebot.com/',
})
export class DependenciesVersionMajorLevel extends PracticeBase {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.packageInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;
    if (!pkgs) {
      return PracticeEvaluationResult.unknown;
    }

    const result = await this.runNcu(pkgs);
    return this.isPracticing(result, SemverLevel.major, pkgs);
  }

  async runNcu(pkgs: Package[] | undefined) {
    const fakePkgJson: { dependencies: { [key: string]: string } } = { dependencies: {} };

    pkgs &&
      pkgs.forEach((p) => {
        fakePkgJson.dependencies[p.name] = p.requestedVersion.value;
      });

    const pkgsToBeUpdated = await ncu.run({
      packageData: JSON.stringify(fakePkgJson),
    });

    return pkgsToBeUpdated;
  }

  isPracticing(pkgsWithNewVersion: { [key: string]: string }, semverLevel: SemverLevel, pkgs: Package[]): PracticeEvaluationResult {
    // packages with Major level to be updated
    const pkgsToUpdate: { name: string; newVersion: string; currentVersion: string }[] = [];

    for (const packageName in pkgsWithNewVersion) {
      const parsedVersion = PackageInspectorBase.semverToPackageVersion(pkgsWithNewVersion[packageName]);
      if (parsedVersion) {
        for (const pkg of pkgs) {
          if (pkg.name === packageName) {
            if (parsedVersion[semverLevel] > pkg.lockfileVersion[semverLevel]) {
              pkgsToUpdate.push({ name: pkg.name, newVersion: parsedVersion.value, currentVersion: pkg.lockfileVersion.value });
            }
          }
        }
      }
    }

    this.data.detail = 'any';

    if (pkgsToUpdate.length > 0) return PracticeEvaluationResult.notPracticing;
    return PracticeEvaluationResult.practicing;
  }
}
