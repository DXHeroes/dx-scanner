"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const ErrorFactory_1 = require("./ErrorFactory");
describe('ErrorFactory', () => {
    it('#newInternalError', async () => {
        try {
            throw ErrorFactory_1.ErrorFactory.newInternalError();
        }
        catch (error) {
            expect(error.name).toEqual('ServiceError');
            expect(error.code).toEqual(model_1.ErrorCode.INTERNAL_ERROR);
            expect(error.stack).toMatch('ServiceError: Crashed due to internal error');
            expect(error.message).toEqual('Crashed due to internal error');
        }
    });
    it('#newArgumentError', async () => {
        try {
            throw ErrorFactory_1.ErrorFactory.newArgumentError();
        }
        catch (error) {
            expect(error.name).toEqual('ServiceError');
            expect(error.code).toEqual(model_1.ErrorCode.ARGUMENT_ERROR);
            expect(error.stack).toMatch('ServiceError: Wrong arguments');
            expect(error.message).toEqual('Wrong arguments');
        }
    });
    it('#newAuthorizationError', async () => {
        try {
            throw ErrorFactory_1.ErrorFactory.newAuthorizationError();
        }
        catch (error) {
            expect(error.name).toEqual('ServiceError');
            expect(error.code).toEqual(model_1.ErrorCode.AUTHORIZATION_ERROR);
            expect(error.stack).toMatch('ServiceError: Unauthorized');
            expect(error.message).toEqual('Unauthorized');
        }
    });
    it('#newNotImplementedError', async () => {
        try {
            throw ErrorFactory_1.ErrorFactory.newNotImplementedError();
        }
        catch (error) {
            expect(error.name).toEqual('ServiceError');
            expect(error.code).toEqual(model_1.ErrorCode.NOT_IMPLEMENTED_ERROR);
            expect(error.stack).toMatch('ServiceError: Not implemented');
            expect(error.message).toEqual('Not implemented');
        }
    });
});
//# sourceMappingURL=ErrorFactory.spec.js.map