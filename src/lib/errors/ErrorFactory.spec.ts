import { ErrorCode } from './model';
import { ErrorFactory } from './ErrorFactory';

describe('ErrorFactory', () => {
  it('#newInternalError', async () => {
    try {
      throw ErrorFactory.newInternalError();
    } catch (error) {
      expect(error.name).toEqual('ServiceError');
      expect(error.code).toEqual(ErrorCode.INTERNAL_ERROR);
      expect(error.stack).toMatch('ServiceError: The app went broken. Sorry about that. Not your fault');
      expect(error.message).toEqual('The app went broken. Sorry about that. Not your fault');
    }
  });

  it('#newArgumentError', async () => {
    try {
      throw ErrorFactory.newArgumentError();
    } catch (error) {
      expect(error.name).toEqual('ServiceError');
      expect(error.code).toEqual(ErrorCode.ARGUMENT_ERROR);
      expect(error.stack).toMatch('ServiceError: Wrong arguments');
      expect(error.message).toEqual('Wrong arguments');
    }
  });

  it('#newAuthorizationError', async () => {
    try {
      throw ErrorFactory.newAuthorizationError();
    } catch (error) {
      expect(error.name).toEqual('ServiceError');
      expect(error.code).toEqual(ErrorCode.AUTHORIZATION_ERROR);
      expect(error.stack).toMatch('ServiceError: Unauthorized');
      expect(error.message).toEqual('Unauthorized');
    }
  });

  it('#newNotImplementedError', async () => {
    try {
      throw ErrorFactory.newNotImplementedError();
    } catch (error) {
      expect(error.name).toEqual('ServiceError');
      expect(error.code).toEqual(ErrorCode.NOT_IMPLEMENTED_ERROR);
      expect(error.stack).toMatch('ServiceError: Not implemented');
      expect(error.message).toEqual('Not implemented');
    }
  });
});
