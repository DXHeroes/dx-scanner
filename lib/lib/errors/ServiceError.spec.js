"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceError_1 = require("./ServiceError");
const model_1 = require("./model");
describe('ServiceError', () => {
    it('constructs an error of class ServiceError', async () => {
        const error = new ServiceError_1.ServiceError({ code: model_1.ErrorCode.SERVICE_ERROR, message: 'my custom error' });
        expect(error instanceof ServiceError_1.ServiceError).toEqual(true);
    });
    it('throws an error', async () => {
        const error = new ServiceError_1.ServiceError({ code: model_1.ErrorCode.SERVICE_ERROR, message: 'my custom error' });
        expect(() => {
            throw error;
        }).toThrowError('my custom error');
        try {
            throw error;
        }
        catch (error) {
            expect(error.name).toEqual('ServiceError');
            expect(error.code).toEqual(model_1.ErrorCode.SERVICE_ERROR);
            expect(error.stack).toMatch('ServiceError: my custom error');
            expect(error.message).toEqual('my custom error');
        }
    });
});
//# sourceMappingURL=ServiceError.spec.js.map