"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ServiceError_1 = require("./ServiceError");
const model_1 = require("./model");
const assertNever_1 = require("../assertNever");
const debug_1 = __importDefault(require("debug"));
const cli_ux_1 = __importDefault(require("cli-ux"));
const d = debug_1.default('errorHandler');
exports.errorHandler = (error) => {
    cli_ux_1.default.action.stop();
    if (error instanceof ServiceError_1.ServiceError) {
        switch (error.code) {
            case model_1.ErrorCode.AUTHORIZATION_ERROR:
                console.error(error.message);
                d(error.stack);
                process.exit(1); //mandatory (as per the Node.js docs)
            case model_1.ErrorCode.SERVICE_ERROR:
            case model_1.ErrorCode.NOT_IMPLEMENTED_ERROR:
            case model_1.ErrorCode.INTERNAL_ERROR:
            case model_1.ErrorCode.ARGUMENT_ERROR:
            case model_1.ErrorCode.PRACTICE_EVALUATION_ERROR:
                cli_ux_1.default.error(error);
            default:
                assertNever_1.assertNever(error.code);
        }
    }
    throw error;
};
//# sourceMappingURL=errorHandler.js.map