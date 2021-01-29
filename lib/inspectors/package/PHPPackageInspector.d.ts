import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
export declare class PHPPackageInspector extends PackageInspectorBase {
    private fileInspector;
    private composerJson;
    private hasLockfileFile;
    constructor(fileInspector: IFileInspector);
    init(): Promise<void>;
    private addPackages;
    hasLockfile(): boolean | undefined;
}
export interface composerJSON {
    name: string;
    type: string;
    description: string | undefined;
    keywords: string[] | undefined;
    homepage: string | undefined;
    license: string | undefined;
    authors: Contributor[] | undefined;
    require: {
        [name: string]: string;
    } | undefined;
    'require-dev': {
        [name: string]: string;
    } | undefined;
    config: PHPConfig | undefined;
    extra: {
        [name: string]: string;
    } | undefined;
    autoload: PHPAutoload | undefined;
    'autoload-dev': PHPAutoload | undefined;
    'minimum-stability': string | undefined;
    'prefer-stable': boolean | undefined;
    support: {
        [name: string]: string;
    } | undefined;
    scripts: {
        [name: string]: string;
    } | undefined;
    bin: string[] | undefined;
    [name: string]: any | undefined;
}
interface Contributor {
    [name: string]: string | undefined;
}
interface PHPConfig {
    platform: {
        [name: string]: string;
    } | undefined;
    'preferred-install': string | undefined;
    'sort-packages': boolean | undefined;
    [name: string]: any | undefined;
}
interface PHPAutoload {
    [name: string]: {
        [name: string]: string;
    } | undefined;
}
export {};
//# sourceMappingURL=PHPPackageInspector.d.ts.map