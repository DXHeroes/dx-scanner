import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '..';
export declare class RubyPackageInspector extends PackageInspectorBase {
    private fileInspector;
    private parsedDependencies;
    constructor(fileInspector: IFileInspector);
    init(): Promise<void>;
    private parseVersion;
    private addPackages;
    hasLockfile(): boolean | undefined;
}
//# sourceMappingURL=RubyPackageInspector.d.ts.map