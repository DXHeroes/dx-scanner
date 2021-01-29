"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = void 0;
class ServiceError extends Error {
    constructor(params) {
        super(params.message);
        this.code = params.code;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
    get name() {
        return this.constructor.name;
    }
}
exports.ServiceError = ServiceError;
//# sourceMappingURL=ServiceError.js.map