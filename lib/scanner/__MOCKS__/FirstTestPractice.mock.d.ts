import { PracticeEvaluationResult } from '../../model';
import { IPractice } from '../../practices/IPractice';
export declare class FirstTestPractice implements IPractice {
    isApplicable(): Promise<boolean>;
    evaluate(): Promise<PracticeEvaluationResult>;
}
//# sourceMappingURL=FirstTestPractice.mock.d.ts.map