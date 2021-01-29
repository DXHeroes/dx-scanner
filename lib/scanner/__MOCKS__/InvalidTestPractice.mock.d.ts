import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../../practices/IPractice';
export declare class InvalidTestPractice implements IPractice {
    isApplicable(): Promise<boolean>;
    evaluate(): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=InvalidTestPractice.mock.d.ts.map