import { ServiceError } from './ServiceError';
import { ErrorCode } from './model';

describe('ServiceError', () => {
  it('constructs an error of class ServiceError', async () => {
    const error = new ServiceError({ code: ErrorCode.SERVICE_ERROR, message: 'my custom error' });

    expect(error instanceof ServiceError).toEqual(true);
  });

  it('throws an error', async () => {
    const error = new ServiceError({ code: ErrorCode.SERVICE_ERROR, message: 'my custom error' });

    expect(() => {
      throw error;
    }).toThrowError('my custom error');

    try {
      throw error;
    } catch (error) {
      expect(error.name).toEqual('ServiceError');
      expect(error.code).toEqual(ErrorCode.SERVICE_ERROR);
      expect(error.stack).toMatch('ServiceError: my custom error');
      expect(error.message).toEqual('my custom error');
    }
  });
});
