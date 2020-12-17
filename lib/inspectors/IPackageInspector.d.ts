export interface IPackageInspector {
    packages: Package[] | undefined;
    init(): Promise<void>;
    hasPackageManagement(): boolean;
    findPackages(searchTerm: string | RegExp): Package[];
    hasPackage(name: string | RegExp, options?: PackageOptions): boolean;
    findPackage(name: string, options?: PackageOptions): Package | undefined;
    hasOneOfPackages(packages: string[]): boolean;
    hasLockfile(): boolean | undefined;
}
export interface PackageOptions {
    version?: string;
    gt?: string;
    lt?: string;
    satisifies?: string;
}
export interface Package {
    name: string;
    requestedVersion: PackageVersion;
    lockfileVersion: PackageVersion;
    dependencyType: DependencyType;
}
export declare enum DependencyType {
    Runtime = "Runtime",
    Dev = "Dev",
    Peer = "Peer"
}
export interface PackageVersion {
    value: string;
    major: string;
    minor: string;
    patch: string;
}
//# sourceMappingURL=IPackageInspector.d.ts.map