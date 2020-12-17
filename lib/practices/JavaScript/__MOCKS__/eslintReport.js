"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEsLintReport = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.getEsLintReport = (params) => {
    return lodash_1.default.merge([
        {
            filePath: '/Users/adelka/lodash/.internal/cloneDataView.js',
            messages: [],
            errorCount: 0,
            warningCount: 0,
            fixableErrorCount: 0,
            fixableWarningCount: 0,
            usedDeprecatedRules: [],
        },
    ], params);
};
//# sourceMappingURL=eslintReport.js.map