import ncu from 'npm-check-updates';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { Package } from '../../inspectors/IPackageInspector';
import { PackageInspectorBase, SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'JavaScript.DependenciesVersionMajorLevel',
  name: 'Update Dependencies of Major Level',
  impact: PracticeImpact.small,
  suggestion: 'Keep the dependencies updated to have all possible features. Use, for example, Renovate Bot.',
  reportOnlyOnce: true,
  url: 'https://renovatebot.com/',
})
export class DependenciesVersionMajorLevel implements IPractice {
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
    if (pkgs === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const result = await DependenciesVersionMajorLevel.runNcu(pkgs);
    const practiceEvaluationResult = DependenciesVersionMajorLevel.isPracticing(result, SemverLevel.major, pkgs);

    return practiceEvaluationResult || PracticeEvaluationResult.practicing;
  }

  static async runNcu(pkgs: Package[] | undefined) {
    const fakePkgJson: { dependencies: { [key: string]: string } } = { dependencies: {} };

    pkgs &&
      pkgs.forEach((p) => {
        fakePkgJson.dependencies[p.name] = p.requestedVersion.value;
      });

    const result = await ncu.run({
      packageData: JSON.stringify(fakePkgJson),
    });

    return result;
  }

  static isPracticing(
    result: { [key: string]: string },
    semverVersion: SemverLevel,
    pkgs: Package[],
  ): PracticeEvaluationResult | undefined {
    for (const packageName in result) {
      const parsedVersion = PackageInspectorBase.semverToPackageVersion(result[packageName]);
      if (parsedVersion) {
        for (const pkg of pkgs) {
          if (pkg.name === packageName) {
            if (parsedVersion[semverVersion] > pkg.lockfileVersion[semverVersion]) {
              return PracticeEvaluationResult.notPracticing;
            }
          }
        }
      }
    }
    return undefined;
  }
}
