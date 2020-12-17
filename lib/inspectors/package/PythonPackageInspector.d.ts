import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '..';
export declare class PythonPackageInspector extends PackageInspectorBase {
    private fileInspector;
    private parsedDependencies;
    constructor(fileInspector: IFileInspector);
    init(): Promise<void>;
    private addPackages;
    hasLockfile(): boolean | undefined;
}
//# sourceMappingURL=PythonPackageInspector.d.ts.map