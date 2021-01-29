export declare class GitLabClient {
    protected headers: {
        [header: string]: string;
    };
    protected host: string;
    protected timeout: number;
    constructor({ token, host, timeout }: ClientOptions);
    protected createAxiosInstance(): import("axios").AxiosInstance;
}
export interface ClientOptions {
    token?: string;
    host?: string;
    timeout?: number;
}
//# sourceMappingURL=GitLabClient.d.ts.map