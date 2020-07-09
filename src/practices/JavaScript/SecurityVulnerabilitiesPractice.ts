import debug from 'debug';
import shell from 'shelljs';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { SecurityIssueDto, SecurityIssueSummaryDto } from '../../reporters';
import { ReportDetailType } from '../../reporters/ReporterData';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';
import { parseYarnAudit, parseNpmAudit } from '../PracticeUtils';
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
    const npmCmd = 'npm audit --json --production --audit-level=high';
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

    let data;
    if (packageManager === PackageManagerType.yarn) {
      const result = shell.exec(yarnCmd, { silent: true });
      data = await parseYarnAudit(result);
      this.setData(data);
      if (data.summary!.code > 15) return PracticeEvaluationResult.notPracticing;
    }

    if (packageManager === PackageManagerType.npm) {
      const result = shell.exec(npmCmd, { silent: true });
      data = await parseNpmAudit(result);
      this.setData(data);
      if (data.summary!.code > 0) return PracticeEvaluationResult.notPracticing;
    }

    return PracticeEvaluationResult.practicing;
  }

  setData(data: { vulnerabilities: SecurityIssueDto[]; summary: SecurityIssueSummaryDto | undefined }): void {
    const vulnerableData = data.vulnerabilities.map((vulnerability: SecurityIssueDto) => ({
      library: vulnerability.library,
      type: vulnerability.type,
      severity: vulnerability.severity,
      dependencyOf: vulnerability.dependencyOf,
      vulnerableVersions: vulnerability.vulnerableVersions,
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
  }
}
