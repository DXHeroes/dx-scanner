import shell from 'shelljs';
import { SecurityIssueDto } from '..';
import { SecurityIssueSummaryDto } from '../reporters';
export declare const parseYarnAudit: (result: shell.ShellString) => Promise<{
    vulnerabilities: SecurityIssueDto[];
    summary: SecurityIssueSummaryDto | undefined;
}>;
export declare const parseNpmAudit: (result: shell.ShellString) => Promise<{
    vulnerabilities: SecurityIssueDto[];
    summary: SecurityIssueSummaryDto | undefined;
}>;
//# sourceMappingURL=PracticeUtils.d.ts.map