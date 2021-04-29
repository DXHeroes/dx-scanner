import { PaginationParams } from '../../../../inspectors';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse } from '../gitlabUtils';
export declare class Contributors extends GitLabClient {
    api: import("axios").AxiosInstance;
    list(projectId: string, pagination?: PaginationParams): Promise<CustomAxiosResponse<Contributor[]>>;
}
export interface Contributor {
    name: string;
    email: string;
    commits: number;
}
//# sourceMappingURL=Contributors.d.ts.map