import axios from 'axios';
import qs from 'qs';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { ReportDetailType } from '../../reporters/ReporterData';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';
import { DependenciesVersionEvaluationUtils } from '../utils/DependenciesVersionEvaluationUtils';
import { UpdatedDependencyDto } from '../..';

@DxPractice({
  id: 'Java.DependenciesVersionMajorLevel',
  name: 'Update Dependencies of Major Level',
  impact: PracticeImpact.small,
  suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, versions-maven-plugin',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/updating-the-dependencies',
  dependsOn: { practicing: ['Java.SpecifiedDependencyVersions'] },
})
export class JavaDependenciesVersionMajorLevel extends PracticeBase {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.packageInspector || !ctx.packageInspector.packages) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;

    const result = await JavaDependenciesVersionMajorLevel.searchMavenCentral(pkgs, 5);
    const pkgsToUpdate = DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, SemverLevel.major, pkgs);
    this.setData(pkgsToUpdate);

    if (pkgsToUpdate.length > 0) return PracticeEvaluationResult.notPracticing;
    return PracticeEvaluationResult.practicing;
  }

  static async searchMavenCentral(pkgs: Package[] | undefined, rows: number) {
    const latestVersionsJson: { [key: string]: string } = {};
    const URL = 'http://search.maven.org/solrsearch/select?';
    if (pkgs) {
      for (const p of pkgs) {
        const listOfIds = p.name.split(':', 2);
        const queryRequest = qs.stringify({ q: `${listOfIds[0]}+AND+a:${listOfIds[1]}`, rows, wt: 'json' }, { encode: false });
        const listVersionsEndpoint = `${URL}${queryRequest}`;

        await axios.get(listVersionsEndpoint).then((response) => {
          latestVersionsJson[p.name] = `${response.data.response.docs.pop().latestVersion}`;
        });
      }
    }
    return latestVersionsJson;
  }

  setData(pkgsToUpdate: UpdatedDependencyDto[]): void {
    this.data.details = [{ type: ReportDetailType.table, headers: ['Library', 'New', 'Current', 'Severity'], data: pkgsToUpdate }];
    this.data.statistics = { updatedDependencies: pkgsToUpdate };
  }
}
