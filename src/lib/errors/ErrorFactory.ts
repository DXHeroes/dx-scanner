import { ErrorCode } from './model';
import { ServiceError } from './ServiceError';

export class ErrorFactory {
  static newInternalError(message = 'Crashed due to internal error') {
    return new ServiceError({
      code: ErrorCode.INTERNAL_ERROR,
      message,
    });
  }

  static newArgumentError(message = 'Wrong arguments') {
    return new ServiceError({
      code: ErrorCode.ARGUMENT_ERROR,
      message,
    });
  }

  static newAuthorizationError(message = 'Unauthorized') {
    return new ServiceError({
      code: ErrorCode.AUTHORIZATION_ERROR,
      message,
    });
  }

  static newNotImplementedError(message = 'Not implemented') {
    return new ServiceError({
      code: ErrorCode.NOT_IMPLEMENTED_ERROR,
      message,
    });
  }

  static newPracticeEvaluateError(message = 'Practice evaluation error') {
    return new ServiceError({
      code: ErrorCode.PRACTICE_EVALUATION_ERROR,
      message,
    })
  }
}
