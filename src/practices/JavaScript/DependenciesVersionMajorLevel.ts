import ncu from 'npm-check-updates';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { DependenciesVersionEvaluationUtils } from '../utils/DependenciesVersionEvaluationUtils';
import { UpdatedDependencyDto } from '../../reporters/DashboardReporter';

@DxPractice({
  id: 'JavaScript.DependenciesVersionMajorLevel',
  name: 'Update Dependencies of Major Level',
  impact: PracticeImpact.small,
  suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, npm-check-updates.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/updating-the-dependencies',
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
    const pkgsToUpdate = DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, SemverLevel.major, pkgs);
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

  setData(pkgsToUpdate: UpdatedDependencyDto[]): void {
    this.data.details = [{ type: ReportDetailType.table, headers: ['Library', 'New', 'Current', 'Severity'], data: pkgsToUpdate }];
    this.data.statistics = { updatedDependencies: pkgsToUpdate };
  }
}
