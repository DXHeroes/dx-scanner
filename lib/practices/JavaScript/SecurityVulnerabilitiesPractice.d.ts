import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { SecurityIssueDto, SecurityIssueSummaryDto } from '../../reporters';
import { PracticeBase } from '../PracticeBase';
export interface NpmAuditOutput {
    advisories: {
        module_name: string;
        severity: string;
        findings?: {
            version: number;
        }[];
    }[];
    error?: Record<string, unknown>;
}
export declare class SecurityVulnerabilitiesPractice extends PracticeBase {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    setData(data: {
        vulnerabilities: SecurityIssueDto[];
        summary: SecurityIssueSummaryDto | undefined;
    }): void;
}
//# sourceMappingURL=SecurityVulnerabilitiesPractice.d.ts.map