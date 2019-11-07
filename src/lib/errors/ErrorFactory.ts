import { ServiceError, ErrorCode } from '.';

export class ErrorFactory {
  static newInternalError(message = 'The app went broken. Sorry about that. Not your fault') {
    return new ServiceError({
      code: ErrorCode.INTERNAL_ERROR,
      message: message,
    });
  }

  static newArgumentError(message = 'Wrong arguments') {
    return new ServiceError({
      code: ErrorCode.ARGUMENT_ERROR,
      message: message,
    });
  }

  static newAuthorizationError(message = 'Unauthorized') {
    return new ServiceError({
      code: ErrorCode.AUTHORIZATION_ERROR,
      message: message,
    });
  }
}
