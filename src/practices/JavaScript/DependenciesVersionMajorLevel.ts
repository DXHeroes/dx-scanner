import ncu from 'npm-check-updates';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { PackageInspectorBase, SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';

@DxPractice({
  id: 'JavaScript.DependenciesVersionMajorLevel',
  name: 'Update Dependencies of Major Level',
  impact: PracticeImpact.small,
  suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, npm-check-updates.',
  reportOnlyOnce: true,
  url: 'https://github.com/tjunnone/npm-check-updates',
})
export class DependenciesVersionMajorLevelPractice extends PracticeBase {
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
    const pkgsToUpdate = this.packagesToBeUpdated(result, SemverLevel.major, pkgs);
    this.setData(pkgsToUpdate);

    if (pkgsToUpdate.length > 0) return PracticeEvaluationResult.notPracticing;
    return PracticeEvaluationResult.practicing;
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

  packagesToBeUpdated(pkgsWithNewVersion: { [key: string]: string }, semverLevel: SemverLevel, pkgs: Package[]) {
    // packages with Major level to be updated
    const pkgsToUpdate: PkgToUpdate[] = [];

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

    return pkgsToUpdate;
  }

  setData(pkgsToUpdate: PkgToUpdate[]): void {
    this.data.details = [{ type: ReportDetailType.table, headers: ['Name', 'New', 'Current'], data: pkgsToUpdate }];
  }
}

export type PkgToUpdate = { name: string; newVersion: string; currentVersion: string };
