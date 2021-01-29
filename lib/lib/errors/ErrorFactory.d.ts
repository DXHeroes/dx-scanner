import { ServiceError } from './ServiceError';
export declare class ErrorFactory {
    static newInternalError(message?: string): ServiceError;
    static newArgumentError(message?: string): ServiceError;
    static newAuthorizationError(message?: string): ServiceError;
    static newNotImplementedError(message?: string): ServiceError;
    static newPracticeEvaluateError(message?: string): ServiceError;
}
//# sourceMappingURL=ErrorFactory.d.ts.map