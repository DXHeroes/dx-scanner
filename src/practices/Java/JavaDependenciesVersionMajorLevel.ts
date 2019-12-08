import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import * as axios from 'axios';
import { DependenciesVersionMajorLevel } from '../JavaScript/DependenciesVersionMajorLevel';

@DxPractice({
  id: 'Java.DependenciesVersionMajorLevel',
  name: 'Update Dependencies of Major Level',
  impact: PracticeImpact.medium,
  suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, Renovate Bot.',
  reportOnlyOnce: true,
  url: 'https://renovatebot.com/',
})
export class JavaDependenciesVersionMajorLevel implements IPractice {
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
    const practiceEvaluationResult = DependenciesVersionMajorLevel.isPracticing(result, SemverLevel.major, pkgs);

    return practiceEvaluationResult || PracticeEvaluationResult.practicing;
  }

  static async searchMavenCentral(pkgs: Package[] | undefined, rows: number) {
    const latestVersionsJson: { [key: string]: string } = {};
    const URL = 'http://search.maven.org/solrsearch/select?q=';
    if (pkgs) {
      for (const p of pkgs) {
        const listOfIds = p.name.split(':', 2);
        const listVersionsEndpoint = `${URL}${listOfIds[0]}+AND+a:${listOfIds[1]}&rows=${rows}&wt=json`;
        await axios.default.get(listVersionsEndpoint).then((response) => {
          latestVersionsJson[p.name] = String(response.data.response.docs.pop().latestVersion);
        });
      }
    }
    return latestVersionsJson;
  }
}
