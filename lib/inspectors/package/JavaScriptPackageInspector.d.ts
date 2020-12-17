import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
export declare class JavaScriptPackageInspector extends PackageInspectorBase {
    private fileInspector;
    private packageJson;
    private hasLockfileFile;
    constructor(fileInspector: IFileInspector);
    init(): Promise<void>;
    private addPackages;
    hasLockfile(): boolean | undefined;
}
export interface PackageJSON {
    name: string;
    version: string;
    main: string;
    repository: string;
    author: string;
    contributors: Contributor[] | undefined;
    license: string;
    engineStrinct: boolean | undefined;
    engines: {
        [name: string]: string;
    } | undefined;
    scripts: {
        [name: string]: string;
    } | undefined;
    dependencies: {
        [name: string]: string;
    } | undefined;
    devDependencies: {
        [name: string]: string;
    } | undefined;
    peerDependencies: {
        [name: string]: string;
    } | undefined;
}
interface Contributor {
    name: string;
    email: string;
    url: string;
}
export {};
//# sourceMappingURL=JavaScriptPackageInspector.d.ts.map