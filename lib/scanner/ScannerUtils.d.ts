import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import { PracticeImpact } from '../model';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { IPractice } from '../practices/IPractice';
import { PracticeWithContext, ScanResult } from './Scanner';
import { PracticeWithContextForReporter } from '../reporters/IReporter';
import { ArgumentsProvider } from '.';
/**
 * Scanner helpers & utilities
 */
export declare class ScannerUtils {
    /**
     * Creates the practice with metadata
     */
    static initPracticeWithMetadata(practice: {
        new (): IPractice;
    }): IPracticeWithMetadata;
    /**
     * Topological sort of directed ascyclic graphs
     */
    static sortPractices(practices: IPracticeWithMetadata[]): IPracticeWithMetadata[];
    /**
     * Checks if the practices has fulfilled all dependencies as expected
     */
    static isFulfilled(practice: IPracticeWithMetadata, evaluatedPractices: PracticeWithContext[]): boolean;
    /**
     * Filter out applicable practices and turned off practices.
     */
    static filterPractices(componentContext: ProjectComponentContext, practices: IPracticeWithMetadata[]): Promise<{
        customApplicablePractices: IPracticeWithMetadata[];
        practicesOff: IPracticeWithMetadata[];
    }>;
    /**
     * Get all levels to fail on
     */
    static getImpactFailureLevels: (impact: PracticeImpact | 'all' | undefined) => PracticeImpact[];
    /**
     * Filter out not practicing practices while they are of the same impact as fail value or higher, or of value 'all'.
     */
    static filterNotPracticingPracticesToFail: (relevantPractices: PracticeWithContextForReporter[], argumentsProvider: ArgumentsProvider) => PracticeWithContextForReporter[];
    /**
     * Sorts practices alphabetically
     */
    static sortAlphabetically: (practices: IPracticeWithMetadata[]) => IPracticeWithMetadata[];
    /**
     * Prompt user to insert credentials to get authorization
     */
    static promptAuthorization(scanPath: string, scanResult: ScanResult): Promise<any>;
}
//# sourceMappingURL=ScannerUtils.d.ts.map