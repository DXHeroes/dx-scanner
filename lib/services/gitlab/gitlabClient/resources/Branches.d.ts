import { PaginationParams } from '../../../../inspectors';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse } from '../gitlabUtils';
export declare class Branches extends GitLabClient {
    api: import("axios").AxiosInstance;
    list(projectId: string, pagination?: PaginationParams): Promise<CustomAxiosResponse<Branch[]>>;
}
export interface Branch {
    name: string;
    default: boolean;
}
//# sourceMappingURL=Branches.d.ts.map