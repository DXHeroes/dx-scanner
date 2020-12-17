"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = void 0;
const model_1 = require("./model");
const ServiceError_1 = require("./ServiceError");
class ErrorFactory {
    static newInternalError(message = 'Crashed due to internal error') {
        return new ServiceError_1.ServiceError({
            code: model_1.ErrorCode.INTERNAL_ERROR,
            message,
        });
    }
    static newArgumentError(message = 'Wrong arguments') {
        return new ServiceError_1.ServiceError({
            code: model_1.ErrorCode.ARGUMENT_ERROR,
            message,
        });
    }
    static newAuthorizationError(message = 'Unauthorized') {
        return new ServiceError_1.ServiceError({
            code: model_1.ErrorCode.AUTHORIZATION_ERROR,
            message,
        });
    }
    static newNotImplementedError(message = 'Not implemented') {
        return new ServiceError_1.ServiceError({
            code: model_1.ErrorCode.NOT_IMPLEMENTED_ERROR,
            message,
        });
    }
    static newPracticeEvaluateError(message = 'Practice evaluation error') {
        return new ServiceError_1.ServiceError({
            code: model_1.ErrorCode.PRACTICE_EVALUATION_ERROR,
            message,
        });
    }
}
exports.ErrorFactory = ErrorFactory;
//# sourceMappingURL=ErrorFactory.js.map