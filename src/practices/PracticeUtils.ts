import shell from 'shelljs';
import { SecurityIssueDto } from '..';
import { SecurityIssueSummaryDto } from '../reporters';
import { NpmAuditOutput } from './JavaScript/SecurityVulnerabilitiesPractice';
import util from 'util';

export const parseYarnAuditJsonLines = async (
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

export const parseNpmAuditJson = async (
  result: shell.ShellString,
): Promise<{
  vulnerabilities: SecurityIssueDto[];
  summary: SecurityIssueSummaryDto | undefined;
}> => {
  // cmd npm audit --json uses json lines
  const arrayOfJSON = result.split('\n');
  const vulnerabilities: SecurityIssueDto[] = [];
  let summary;

  arrayOfJSON.forEach((json) => {
    if (json !== '') {
      const element = JSON.parse(json);

      if (element?.data?.advisory) {
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
