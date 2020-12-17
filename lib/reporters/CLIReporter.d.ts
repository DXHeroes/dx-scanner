import { ScanningStrategy } from '../detectors';
import { ArgumentsProvider } from '../scanner';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
export declare class CLIReporter implements IReporter {
    private readonly argumentsProvider;
    private readonly scanningStrategy;
    constructor(argumentsProvider: ArgumentsProvider, scanningStrategy: ScanningStrategy);
    report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void>;
    buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string;
    private emitImpactSegment;
    private linesForPractice;
    private lineForChangedImpact;
    private renderDetail;
}
//# sourceMappingURL=CLIReporter.d.ts.map