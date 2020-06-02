import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import shell from 'shelljs';
import debug from 'debug';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { map } from 'lodash';
import { PackageManagerType, PackageManagerUtils } from '../utils/PackageManagerUtils';

interface NpmAuditOutput {
  actions: { action: string; module: string; target?: string }[];
  error?: Record<string, unknown>;
}

interface YarnAuditOutput {
  data: { vulnerabilities: { [key: string]: number } };
}

const securityVulnerabilitiesPracticeDebug = debug('SecurityVulnerabilitiesPractice');

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

    const packageManager = await PackageManagerUtils.getPackageManagerInstalled(ctx.fileInspector);
    if (packageManager === PackageManagerType.unknown) {
      securityVulnerabilitiesPracticeDebug(
        'Cannot establish package-manager type, missing package-lock.json and yarn.lock or npm command not installed.',
      );
      return PracticeEvaluationResult.unknown;
    }
    const currentDir = shell.pwd();
    shell.cd(ctx.fileInspector?.basePath);
    const result = shell.exec(packageManager === PackageManagerType.npm ? npmCmd : yarnCmd, { silent: true });
    shell.cd(currentDir);
    const data =
      packageManager === PackageManagerType.npm ? (JSON.parse(result) as NpmAuditOutput) : (JSON.parse(result) as YarnAuditOutput);
    if (packageManager === PackageManagerType.npm && (data as NpmAuditOutput).error) {
      securityVulnerabilitiesPracticeDebug('Something went wrong.');
      return PracticeEvaluationResult.unknown;
    }
    this.setData(data, packageManager);
    if (packageManager === PackageManagerType.npm && result.code > 0) return PracticeEvaluationResult.notPracticing;
    if (result.code > 15) return PracticeEvaluationResult.notPracticing; // only other option is Yarn
    return PracticeEvaluationResult.practicing;
  }

  setData<T extends PackageManagerType>(
    data: T extends PackageManagerType.npm ? NpmAuditOutput : T extends PackageManagerType.yarn ? YarnAuditOutput : unknown,
    packageManager: T,
  ): void {
    if (packageManager === PackageManagerType.npm) {
      this.data.details = [
        {
          type: ReportDetailType.table,
          headers: ['Action', 'Module', 'Version'],
          data: (data as NpmAuditOutput).actions.map((action) => ({
            action: action.action,
            module: action.module,
            version: action.target as string,
          })),
        },
      ];
    } else if (packageManager === PackageManagerType.yarn) {
      this.data.details = [
        {
          type: ReportDetailType.table,
          headers: ['Severity', 'Vulnerabilities'],
          data: map((data as YarnAuditOutput).data.vulnerabilities, (value, key) => ({ key, value })),
        },
      ];
    }
  }
}
