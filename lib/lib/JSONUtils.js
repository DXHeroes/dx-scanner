"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONUtils = void 0;
const ErrorFactory_1 = require("./errors/ErrorFactory");
class JSONUtils {
    static readAsJSON(text) {
        let content;
        try {
            content = JSON.parse(text);
        }
        catch (error) {
            throw ErrorFactory_1.ErrorFactory.newInternalError('JSON parse error');
        }
        return content;
    }
}
exports.JSONUtils = JSONUtils;
//# sourceMappingURL=JSONUtils.js.map