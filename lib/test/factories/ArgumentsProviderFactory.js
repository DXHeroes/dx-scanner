"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentsProviderFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
const model_1 = require("../../model");
exports.argumentsProviderFactory = (params = {}) => {
    return lodash_1.default.merge({
        uri: './',
        auth: undefined,
        json: false,
        details: false,
        fail: model_1.PracticeImpact.off,
        recursive: true,
        ci: false,
        fix: false,
        fixPattern: undefined,
        html: false,
        apiToken: undefined,
        apiUrl: 'https://provider.dxscanner.io/api/v1',
    }, params);
};
//# sourceMappingURL=ArgumentsProviderFactory.js.map