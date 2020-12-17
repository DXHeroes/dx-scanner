import { ArgumentsProvider } from '.';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import { ScanningStrategy } from '../detectors';
import { ServiceType } from '../detectors/IScanningStrategy';
import { PracticeEvaluationResult } from '../model';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { FileSystemService } from '../services';
import { DiscoveryContextFactory } from '../types';
import { ScanningStrategyExplorer } from './ScanningStrategyExplorer';
export declare class Scanner {
    private readonly scanStrategyExplorer;
    private readonly discoveryContextFactory;
    private readonly fileSystemService;
    private readonly practices;
    private readonly argumentsProvider;
    private readonly d;
    private shouldExitOnEnd;
    private allDetectedComponents;
    constructor(scanStrategyExplorer: ScanningStrategyExplorer, discoveryContextFactory: DiscoveryContextFactory, fileSystemService: FileSystemService, practices: IPracticeWithMetadata[], argumentsProvider: ArgumentsProvider);
    scan({ determineRemote }?: {
        determineRemote: boolean;
    }): Promise<ScanResult>;
    /**
     * Initialize Scanner configuration
     */
    init(scanPath: string): Promise<void>;
    fix(practicesWithContext: PracticeWithContext[], scanningStrategy?: ScanningStrategy): Promise<void>;
    /**
     * Clone a repository if the input is remote repository
     */
    private preprocessData;
    /**
     * Detect all languages
     */
    private detectLanguagesAtPaths;
    /**
     * Detect project components (backend, frontend, libraries, etc.)
     */
    private detectProjectComponents;
    /**
     * Detect applicable practices for each component
     */
    private detectPractices;
    /**
     * Report result with specific reporter
     */
    private report;
    /**
     * Detect and evaluate applicable practices for a given component
     */
    private detectPracticesForComponent;
    /**
     * Get all relevant components.
     */
    private getRelevantComponents;
    private createConfiguration;
    listPractices(): IPracticeWithMetadata[];
}
export interface PracticeWithContext {
    componentContext: ProjectComponentContext;
    practiceContext: PracticeContext;
    practice: IPracticeWithMetadata;
    evaluation: PracticeEvaluationResult;
    evaluationError: undefined | string;
    isOn: boolean;
}
export declare type ScanResult = {
    shouldExitOnEnd: boolean;
    needsAuth?: boolean;
    serviceType?: ServiceType;
    isOnline?: boolean;
};
//# sourceMappingURL=Scanner.d.ts.map