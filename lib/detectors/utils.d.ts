import { PackageManagement } from '../model';
export declare const fileExtensionRegExp: (extensions: string[]) => RegExp;
export declare const fileNameRegExp: (name: string) => RegExp;
/**
 * Get common prefix of all paths
 */
export declare const sharedSubpath: (paths: string[]) => string;
export declare const hasOneOfPackages: (packages: string[], packageManagement?: PackageManagement | undefined) => boolean;
export declare const debugLog: (namespace: string) => (...args: unknown[]) => void;
//# sourceMappingURL=utils.d.ts.map