import { FixerContext } from '../../contexts/fixer/FixerContext';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult } from '../../model';
import { LinterIssueDto } from '../../reporters';
import { PracticeBase } from '../PracticeBase';
export declare class ESLintWithoutErrorsPractice extends PracticeBase {
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    private runEslint;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    fix(ctx: FixerContext): Promise<void>;
    setData(linterIssues: LinterIssueDto[]): void;
}
//# sourceMappingURL=ESLintWithoutErrorsPractice.d.ts.map