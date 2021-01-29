/// <reference types="debug" />
import { IInitiable } from '../../lib/IInitable';
import { IPackageInspector, Package, PackageOptions, PackageVersion } from '../IPackageInspector';
export declare abstract class PackageInspectorBase implements IPackageInspector, IInitiable {
    packages: Package[] | undefined;
    abstract init(): Promise<void>;
    abstract hasLockfile(): boolean | undefined;
    protected debug: debug.Debugger;
    constructor();
    hasPackageManagement(): boolean;
    findPackages(searchTerm: string | RegExp): Package[];
    hasPackage(name: string | RegExp, options?: PackageOptions | undefined): boolean;
    hasOneOfPackages(packages: string[]): boolean;
    findPackage(name: string, options?: PackageOptions | undefined): Package | undefined;
    static semverToPackageVersion(semverString: string): PackageVersion | undefined;
}
export declare enum SemverLevel {
    major = "major",
    minor = "minor",
    patch = "patch"
}
//# sourceMappingURL=PackageInspectorBase.d.ts.map