"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNever = void 0;
const errors_1 = require("./errors");
exports.assertNever = (x) => {
    throw errors_1.ErrorFactory.newInternalError('Unexpected object: ' + x);
};
//# sourceMappingURL=assertNever.js.map