import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse } from '../gitlabUtils';
export declare class Version extends GitLabClient {
    api: import("axios").AxiosInstance;
    check(): Promise<CustomAxiosResponse<VersionResponse>>;
}
export declare type VersionResponse = {
    version: string;
    revision: string;
};
//# sourceMappingURL=Version.d.ts.map