import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
export declare class GoPackageInspector extends PackageInspectorBase {
    private fileInspector;
    private goMod;
    private hasLockfileFile;
    constructor(fileInspector: IFileInspector);
    init(): Promise<void>;
    hasLockfile(): boolean;
    private addPkgs;
    private resolveGoModString;
}
export interface GoMod {
    name: string;
    goVersion: string;
}
//# sourceMappingURL=GoPackageInspector.d.ts.map