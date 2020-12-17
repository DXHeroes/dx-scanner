import { IFileInspector } from '../../inspectors';
export declare class PackageManagerUtils {
    /** Guess the package manager by lockfiles and shrinkfile */
    static getPackageManager: (fileInspector?: IFileInspector | undefined) => Promise<PackageManagerType>;
    /** Checks if the provided package manager is installed and fallback if possible */
    static packageManagerInstalled: (packageManager: PackageManagerType) => PackageManagerType;
    /** Guess the package manager by lockfiles and then checks if its installed. Fallback if possible */
    static getPackageManagerInstalled: (fileInspector?: IFileInspector | undefined) => Promise<PackageManagerType>;
    static installPackage: (fileInspector: IFileInspector, packageName: string, options?: {
        dev: boolean;
    }) => Promise<void>;
}
export declare enum PackageManagerType {
    unknown = "unknown",
    npm = "npm",
    yarn = "yarn"
}
//# sourceMappingURL=PackageManagerUtils.d.ts.map