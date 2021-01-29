import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { ArgumentsProvider } from '../scanner';
import { FileSystemService } from '../services';
import { ScanningStrategy } from '../detectors';
export declare class HTMLReporter implements IReporter {
    private readonly argumentsProvider;
    private readonly fileSystemService;
    private readonly scanningStrategy;
    constructor(argumentsProvider: ArgumentsProvider, fileSystemService: FileSystemService, scanningStrategy: ScanningStrategy);
    report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void>;
    buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string;
    private emitImpactSegment;
    private linesForPractice;
    private renderDetail;
    private renderPracticesAndComponents;
}
//# sourceMappingURL=HTMLReporter.d.ts.map