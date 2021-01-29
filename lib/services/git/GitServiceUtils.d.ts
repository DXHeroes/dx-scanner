import { ScanningStrategy } from '../../detectors';
import { ServiceType } from '../../detectors/IScanningStrategy';
import { ProjectComponent } from '../../model';
export declare class GitServiceUtils {
    static getUrlToRepo: (url: string, scanningStrategy: ScanningStrategy, path?: string | undefined, branch?: string) => string;
    static parseUrl: (url: string) => ParsedUrl;
    static getPath: (componentPath: string, branch: string | undefined, serviceType: ServiceType) => string;
    static getRepoName: (repositoryPath: string | undefined, path: string) => string;
    static getPathOrRepoUrl: (url: string, scanningStrategy: ScanningStrategy, path?: string | undefined, branch?: string) => string;
    static getComponentPath: (component: ProjectComponent, scanningStrategy: ScanningStrategy) => string;
    static getComponentLocalPath: (component: ProjectComponent, scanningStrategy: ScanningStrategy) => string;
}
export interface ParsedUrl {
    owner: string;
    repoName: string;
    host: string;
    protocol: string;
}
//# sourceMappingURL=GitServiceUtils.d.ts.map