import { ErrorCode } from './model';
export declare class ServiceError extends Error {
    readonly code: ErrorCode;
    constructor(params: ServiceErrorParams);
    get name(): string;
}
export interface ServiceErrorParams {
    code: ErrorCode;
    message: string;
}
//# sourceMappingURL=ServiceError.d.ts.map