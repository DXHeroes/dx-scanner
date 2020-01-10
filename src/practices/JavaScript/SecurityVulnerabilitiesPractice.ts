import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import shell from 'shelljs';
import debug from 'debug';
import { sync as commandExistsSync } from 'command-exists';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { map } from 'lodash';

enum PackageManagerType {
  unknown = 'unknown',
  npm = 'npm',
  yarn = 'yarn',
}

@DxPractice({
  id: 'JavaScript.SecurityVulnerabilities',
  name: 'Security vulnerabilities detected',
  impact: PracticeImpact.high,
  suggestion: 'Some high-severity security vulnerabilities were detected. Use npm/yarn audit or Snyk to fix them.',
  reportOnlyOnce: true,
  url: 'https://snyk.io/',
})
export class SecurityVulnerabilitiesPractice extends PracticeBase {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const npmCmd = 'npm audit --audit-level=high --json';
    const yarnCmd = 'yarn audit --summary --json';
    const getPackageManager = async () => {
      const packageLockExists = await ctx.fileInspector?.exists('./package-lock.json');
      if (packageLockExists) return PackageManagerType.npm;
      const shrinkwrapExists = await ctx.fileInspector?.exists('./npm-shrinkwrap.json');
      if (shrinkwrapExists) return PackageManagerType.npm;
      const yarnLockExists = await ctx.fileInspector?.exists('./yarn.lock');
      if (yarnLockExists) return PackageManagerType.yarn;
      return PackageManagerType.unknown;
    };

    const pmInstalled = (packageManager: PackageManagerType) => {
      const hasNpm = commandExistsSync('npm');
      const hasYarn = commandExistsSync('yarn');

      if (packageManager === PackageManagerType.yarn) {
        if (hasYarn) return packageManager;
        else {
          packageManager = PackageManagerType.npm; // fallback from yarn to npm
        }
      }

      if (packageManager === PackageManagerType.npm && hasNpm) return packageManager;

      return PackageManagerType.unknown;
    };

    let packageManager = await getPackageManager();
    packageManager = pmInstalled(packageManager);
    if (packageManager === PackageManagerType.unknown) {
      const securityVulnerabilitiesPracticeDebug = debug('SecurityVulnerabilitiesPractice');
      securityVulnerabilitiesPracticeDebug(
        'Cannot establish package-manager type, missing package-lock.json and yarn.lock or npm command not installed.',
      );
      return PracticeEvaluationResult.unknown;
    }
    const currentDir = shell.pwd();
    shell.cd(ctx.fileInspector?.basePath);
    const result = shell.exec(packageManager === PackageManagerType.npm ? npmCmd : yarnCmd, { silent: true });
    shell.cd(currentDir);
    this.setData(result, packageManager);
    if (packageManager === PackageManagerType.npm && result.code > 0) return PracticeEvaluationResult.notPracticing;
    if (result.code > 15) return PracticeEvaluationResult.notPracticing; // only other option is Yarn
    return PracticeEvaluationResult.practicing;
  }

  setData(result: string, packageManager: PackageManagerType): void {
    if (packageManager === PackageManagerType.npm) {
      const data = JSON.parse(result);
      this.data.details = [
        {
          type: ReportDetailType.table,
          headers: ['Action', 'Module', 'Version'],
          data: data.actions.map((action: { action: string; module: string; target?: string }) => ({
            action: action.action,
            module: action.module,
            version: action.target,
          })),
        },
      ];
    } else if (packageManager === PackageManagerType.yarn) {
      const data = JSON.parse(result);
      this.data.details = [
        {
          type: ReportDetailType.table,
          headers: ['Severity', 'Vulnerabilities'],
          data: map(data.data.vulnerabilities, (value: number, key: string) => ({ key, value })),
        },
      ];
    }
  }
}
