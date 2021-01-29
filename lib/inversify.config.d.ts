import { Container } from 'inversify';
import { DirectoryJSON } from 'memfs/lib/volume';
import { FixerContext } from './contexts/fixer/FixerContext';
import { PracticeContext } from './contexts/practice/PracticeContext';
import { ScanningStrategyDetector } from './detectors';
import { IFileInspector, IPackageInspector } from './inspectors';
import { ICollaborationInspector } from './inspectors/ICollaborationInspector';
import { IIssueTrackingInspector } from './inspectors/IIssueTrackingInspector';
import { ProjectComponent } from './model';
import { ArgumentsProvider } from './scanner';
import { ScanningStrategyExplorer } from './scanner/ScanningStrategyExplorer';
import { FileSystemService } from './services';
export declare const createRootContainer: (args: ArgumentsProvider) => Container;
export declare const createTestContainer: (args?: Partial<ArgumentsProvider> | undefined, structure?: DirectoryJSON | undefined, projectComponent?: ProjectComponent | undefined) => TestContainerContext;
export interface TestContainerContext {
    container: Container;
    practiceContext: PracticeContext;
    fixerContext: FixerContext;
    scanningStrategyExplorer: ScanningStrategyExplorer;
    scanningStrategyDetector: ScanningStrategyDetector;
    /**
     * Services
     */
    fileSystemService: FileSystemService;
    virtualFileSystemService: FileSystemService;
}
export interface TestPracticeContext extends PracticeContext {
    packageInspector: IPackageInspector;
    fileInspector: IFileInspector;
    issueTrackingInspector: IIssueTrackingInspector;
    collaborationInspector: ICollaborationInspector;
}
//# sourceMappingURL=inversify.config.d.ts.map