import shell from 'shelljs';
import { SecurityIssueDto } from '..';
import { SecurityIssueSummaryDto } from '../reporters';

export const parseYarnAudit = async (
  result: shell.ShellString,
): Promise<{
  vulnerabilities: SecurityIssueDto[];
  summary: SecurityIssueSummaryDto | undefined;
}> => {
  // cmd yarn audit --json uses json lines
  const arrayOfJSON = result.split('\n');

  const vulnerabilities: SecurityIssueDto[] = [];
  let summary;

  arrayOfJSON.forEach((json) => {
    if (json !== '') {
      const element = JSON.parse(json);
      if (element?.data?.advisory) {
        // https://github.com/yarnpkg/yarn/blob/158da6c6287cbc4fee900e3704f140c3391dc28d/src/reporters/console/console-reporter.js
        const path = element.data.resolution?.path?.split('>').join(' > ');
        const dependencyOf = element?.data?.resolution?.path?.split('>')[0];
        const patchedIn =
          element.data.advisory.patched_versions.replace(' ', '') === '<0.0.0'
            ? 'No patch available'
            : element.data.advisory.patched_versions;

        const vulnerability: SecurityIssueDto = {
          library: element.data.advisory.module_name,
          type: element.data.advisory.title,
          severity: element.data.advisory.severity,
          dependencyOf,
          path,
          patchedIn,
          vulnerable_versions: element.data.advisory.vulnerable_versions,
        };
        vulnerabilities.push(vulnerability);
      }

      if (element.type === 'auditSummary') {
        summary = {
          info: element.data.vulnerabilities.info,
          low: element.data.vulnerabilities.low,
          moderate: element.data.vulnerabilities.moderate,
          high: element.data.vulnerabilities.high,
          critical: element.data.vulnerabilities.critical,
          code: result.code,
        };
      }
    }
  });

  return { vulnerabilities, summary };
};

export const parseNpmAudit = async (
  result: shell.ShellString,
): Promise<{
  vulnerabilities: SecurityIssueDto[];
  summary: SecurityIssueSummaryDto | undefined;
}> => {
  const vulnerabilities: SecurityIssueDto[] = [];
  let summary;
  const data = JSON.parse(result.stdout);

  if (data.error) {
    throw new Error(data.error.detail);
  }

  //https://github.com/npm/npm-audit-report/blob/v1.3.3/reporters/detail.js
  if (Object.keys(data.advisories).length !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.actions.forEach((action: { resolves: any[] }) => {
      action.resolves.forEach((resolution) => {
        const advisory = data.advisories[resolution.id];

        const vulnerability: SecurityIssueDto = {
          library: advisory.module_name,
          type: advisory.title,
          severity: advisory.severity,
          vulnerable_versions: advisory.vulnerable_versions,
          patchedIn: advisory.patched_versions,
          dependencyOf: resolution.path.split('>')[0],
          path: resolution.path.split('>').join(' > '),
        };
        vulnerabilities.push(vulnerability);
      });
    });

    if (data.metadata) {
      summary = {
        info: data.metadata.vulnerabilities.info,
        low: data.metadata.vulnerabilities.low,
        moderate: data.metadata.vulnerabilities.moderate,
        high: data.metadata.vulnerabilities.high,
        critical: data.metadata.vulnerabilities.critical,
        code: result.code,
      };
    }
  }
  return { vulnerabilities, summary };
};
