import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
export declare class RustPackageInspector extends PackageInspectorBase {
    private readonly fileInspector;
    cargoLock?: CargoLock;
    cargoManifest?: CargoManifest | CargoWorkspaceManifest;
    constructor(fileInspector: IFileInspector);
    init(): Promise<void>;
    hasLockfile(): boolean | undefined;
    private static parseWorkspace;
    private static parseDependency;
    private static parseDependencies;
    private static parseDependencySet;
    private static parseTarget;
    private static parseBinaryInfo;
    private static parseBin;
    private static parsePackage;
    private static parseLockPackage;
    private static parseLock;
    private static parseSemver;
    private static addPackages;
}
export interface ManifestDependency {
    name: string;
    version?: string;
    path?: string;
    git?: string;
    branch?: string;
    package?: string;
    optional?: boolean;
    'default-features'?: boolean;
    features?: string[];
    registry?: string;
}
export interface BinaryInfo {
    name: string;
    path: string;
}
export interface DependecySet {
    dependencies: ReadonlyArray<ManifestDependency>;
    'dev-dependencies': ReadonlyArray<ManifestDependency>;
    'build-dependencies': ReadonlyArray<ManifestDependency>;
}
export interface CargoManifest extends DependecySet {
    package: {
        name: string;
        version: string;
        authors?: string[];
        edition?: '2015' | '2018';
        description?: string;
        documentation?: string;
        readme?: string;
        homepage?: string;
        repository?: string;
        license?: string;
        'license-file'?: string;
        keywords?: string[];
        categories?: string[];
        workspace?: string;
        build?: string;
        links?: string;
        exclude?: string[];
        include?: string[];
        publish?: boolean | string[];
        metadata?: Record<string, unknown>;
        'default-run'?: string;
    };
    bin: ReadonlyArray<BinaryInfo>;
    target: Record<string, DependecySet>;
    profile?: unknown;
}
export interface CargoWorkspaceManifest {
    workspace: {
        members: string[];
    };
}
export interface CargoLockPackage {
    name: string;
    version: string;
    source?: string;
    checksum?: string;
    dependencies?: string[];
}
export interface CargoLock {
    package: ReadonlyArray<CargoLockPackage>;
}
//# sourceMappingURL=RustPackageInspector.d.ts.map