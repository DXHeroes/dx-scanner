import { ScanningStrategy } from '../detectors';
import { ArgumentsProvider } from '../scanner';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
export declare class FixReporter implements IReporter {
    private readonly argumentsProvider;
    private readonly scanningStrategy;
    constructor(argumentsProvider: ArgumentsProvider, scanningStrategy: ScanningStrategy);
    report(practicesAndComponents: PracticeWithContextForReporter[], practicesAndComponentsAfterFix: PracticeWithContextForReporter[]): Promise<void>;
    buildReport(practicesAndComponents: PracticeWithContextForReporter[], practicesAndComponentsAfterFix: PracticeWithContextForReporter[]): string;
}
//# sourceMappingURL=FixReporter.d.ts.map