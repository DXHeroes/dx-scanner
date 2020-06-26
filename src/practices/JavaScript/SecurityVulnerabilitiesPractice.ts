import debug from 'debug';
import shell from 'shelljs';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { SecurityIssueDto, SecurityIssueSummaryDto } from '../../reporters';
import { ReportDetailType } from '../../reporters/ReporterData';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';
import { parseYarnAuditJsonLines, parseNpmAuditJson } from '../PracticeUtils';
import { PackageManagerType, PackageManagerUtils } from '../utils/PackageManagerUtils';

export interface NpmAuditOutput {
  advisories: { module_name: string; severity: string; findings?: { version: number }[] }[];
  error?: Record<string, unknown>;
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
    // use --production to show just security issues for dependencies
    const npmCmd = 'npm audit --json --production';
    // use --groups=dependencies to show just security issues for dependencies
    const yarnCmd = 'yarn audit --json --groups dependencies';

    const packageManager = await PackageManagerUtils.getPackageManagerInstalled(ctx.fileInspector);
    if (packageManager === PackageManagerType.unknown) {
      securityVulnerabilitiesPracticeDebug(
        'Cannot establish package-manager type, missing package-lock.json and yarn.lock or npm command not installed.',
      );
      return PracticeEvaluationResult.unknown;
    }

    const currentDir = shell.pwd();
    shell.cd(ctx.fileInspector?.basePath);
    shell.cd(currentDir);

    const cmd = packageManager === PackageManagerType.npm ? npmCmd : yarnCmd;
    const result = shell.exec(cmd, { silent: true });

    const data = packageManager === PackageManagerType.npm ? await parseYarnAuditJsonLines(result) : await parseNpmAuditJson(result);
    this.setData(data);
    if (data.summary!.code > 15) return PracticeEvaluationResult.notPracticing;

    return PracticeEvaluationResult.notPracticing;

    // ----------------------------------------------------------------------------------------
    // add also for NPM
    // const currentDir = shell.pwd();

    // const result = shell.exec(npmCmd, { silent: true });
    // shell.cd(currentDir);

    // const data = await parseNpmAuditJsonLines(result);
    // this.setData(<any>data);

    // const data =
    //   packageManager === PackageManagerType.npm
    //     ? (JSON.parse(result) as NpmAuditOutput)
    //     : {
    //         type: 'auditSummary',
    //         data: {
    //           vulnerabilities: { info: 0, low: 12, moderate: 0, high: 0, critical: 0 },
    //           dependencies: 2188,
    //           devDependencies: 0,
    //           optionalDependencies: 0,
    //           totalDependencies: 2188,
    //         },
    //       };

    // if (packageManager === PackageManagerType.npm && (data as NpmAuditOutput).error) {
    //   securityVulnerabilitiesPracticeDebug('Something went wrong.');
    //   return PracticeEvaluationResult.unknown;
    // }

    // if (packageManager === PackageManagerType.npm && result.code > 0) return PracticeEvaluationResult.notPracticing;
  }

  setData(data: { vulnerabilities: SecurityIssueDto[]; summary: SecurityIssueSummaryDto | undefined }): void {
    const vulnerableData = data.vulnerabilities.map((vulnerability: SecurityIssueDto) => ({
      library: vulnerability.library,
      type: vulnerability.type,
      severity: vulnerability.severity,
      dependencyOf: vulnerability.dependencyOf,
      vulnerable_versions: vulnerability.vulnerable_versions,
      patchedIn: vulnerability.patchedIn,
      path: vulnerability.path,
    }));

    this.data.details = [
      {
        type: ReportDetailType.table,
        headers: ['Library', 'Type', 'Severity', 'Dependency Of', 'Vulnerable Versions', 'Patched In', 'Path'],
        data: vulnerableData,
      },
    ];

    this.data.statistics = { securityIssues: vulnerableData, summary: data.summary };
    // console.log(this.data.details, 'details');

    // // console.log(util.inspect(this.data.details, { showHidden: false, depth: null }));

    // this.data.details = [
    //   {
    //     type: ReportDetailType.table,
    //     headers: ['Action', 'Module', 'Version'],
    //     data: (data as NpmAuditOutput).actions.map((action) => ({
    //       action: action.action,
    //       module: action.module,
    //       version: action.target as string,
    //     })),
    //   },
    // ];
    // console.log(util.inspect(this.data.details + `\n details 152`, { showHidden: false, depth: null }));
    // // console.log(this.data.details, 'details 152');

    // if (packageManager === PackageManagerType.npm) {
    //   // console.log(data, 'npm-data');
    //   //this.data.statistics?.securityIssue
    //   this.data.details = [
    //     {
    //       type: ReportDetailType.table,
    //       headers: ['Action', 'Module', 'Version'],
    //       data: (data as NpmAuditOutput).actions.map((action) => ({
    //         action: action.action,
    //         module: action.module,
    //         version: action.target as string,
    //       })),
    //     },
    //   ];
    // } else if (packageManager === PackageManagerType.yarn) {
    //   // const securityIssue: SecurityIssueDto =
    //   //console.log(data, 'yarn-data');

    //   this.data.details = [
    //     {
    //       type: ReportDetailType.table,
    //       headers: ['Severity', 'Vulnerabilities'],
    //       data: map((data as YarnAuditOutput).data.vulnerabilities, (value, key) => ({ key, value })),
    //     },
    //   ];
    //   // console.log(util.inspect(this.data.details, { showHidden: false, depth: null }));
    // }
  }
}
