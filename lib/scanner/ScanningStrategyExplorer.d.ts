import { ArgumentsProvider } from '.';
import { RepositoryConfig } from './RepositoryConfig';
export declare class ScanningStrategyExplorer {
    private readonly argumentsProvider;
    private readonly d;
    constructor(argumentsProvider: ArgumentsProvider);
    explore(): Promise<RepositoryConfig>;
    private determineRemote;
}
//# sourceMappingURL=ScanningStrategyExplorer.d.ts.map