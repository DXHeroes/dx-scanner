import { PracticeMetadata, ProjectComponent } from '../model';
import { PracticeWithContextForReporter } from './IReporter';
import { DXScoreOverallResult } from './model';
import { ScanningStrategy } from '../detectors';
export declare class ReporterUtils {
    static getComponentsWithPractices(practicesAndComponents: PracticeWithContextForReporter[], scanningStrategy: ScanningStrategy): ComponentWithPractices[];
    static computeDXScore(practicesAndComponents: PracticeWithContextForReporter[], scanningStrategy: ScanningStrategy): DXScoreOverallResult;
    private static computeDXScoreResult;
    static scoreValueForPractice(practiceMetadata: PracticeMetadata): number;
}
export declare type ComponentWithPractices = {
    component: ProjectComponent;
    practicesAndComponents: PracticeWithContextForReporter[];
};
//# sourceMappingURL=ReporterUtils.d.ts.map