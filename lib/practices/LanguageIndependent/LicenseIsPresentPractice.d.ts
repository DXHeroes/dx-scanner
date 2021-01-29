import { IPractice } from '../IPractice';
import { PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { FixerContext } from '../../contexts/fixer/FixerContext';
export declare class LicenseIsPresentPractice implements IPractice {
    isApplicable(): Promise<boolean>;
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    private getDefaultLicense;
    fix(ctx: FixerContext): Promise<void>;
}
//# sourceMappingURL=LicenseIsPresentPractice.d.ts.map