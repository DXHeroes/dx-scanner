import { IReporter, JSONReport, PracticeWithContextForReporter } from './IReporter';
import { ArgumentsProvider } from '../scanner';
export declare class JSONReporter implements IReporter {
    private readonly argumentsProvider;
    constructor(argumentsProvider: ArgumentsProvider);
    report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void>;
    buildReport(practicesAndComponents: PracticeWithContextForReporter[]): JSONReport;
}
//# sourceMappingURL=JSONReporter.d.ts.map