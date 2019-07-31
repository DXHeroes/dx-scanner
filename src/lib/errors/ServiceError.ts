import { ErrorCode } from './model';

export class ServiceError extends Error {
  private code: string;
  constructor(params: ServiceErrorParams) {
    super(params.message);

    this.code = params.code;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }

  get name() {
    return this.constructor.name;
  }
}

export interface ServiceErrorParams {
  code: ErrorCode;
  message: string;
}
