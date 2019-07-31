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
});
