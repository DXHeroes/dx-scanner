import { PaginationParams } from '../../../../inspectors';
import { GitLabClient } from '../GitLabClient';
import { CustomAxiosResponse } from '../gitlabUtils';
import { Commit } from './MergeRequests';
export declare class Commits extends GitLabClient {
    api: import("axios").AxiosInstance;
    list(projectId: string, pagination?: PaginationParams): Promise<CustomAxiosResponse<Commit[]>>;
    get(projectId: string, commitId: string): Promise<CustomAxiosResponse<Commit>>;
}
//# sourceMappingURL=Commits.d.ts.map