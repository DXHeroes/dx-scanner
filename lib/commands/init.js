"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("../detectors/utils");
const inversify_config_1 = require("../inversify.config");
const model_1 = require("../model");
const scanner_1 = require("../scanner");
class Init {
    static async run(cmd) {
        utils_1.debugLog('cli')(cmd);
        const scanPath = process.cwd();
        const container = inversify_config_1.createRootContainer({
            uri: scanPath,
            json: false,
            details: false,
            auth: undefined,
            ci: false,
            recursive: false,
            fail: model_1.PracticeImpact.off,
            fix: false,
            fixPattern: undefined,
            html: false,
            apiToken: undefined,
            apiUrl: 'https://provider.dxscanner.io/api/v1',
        });
        const scanner = container.get(scanner_1.Scanner);
        await scanner.init(path_1.default.normalize(scanPath + path_1.default.sep));
    }
}
exports.default = Init;
//# sourceMappingURL=init.js.map