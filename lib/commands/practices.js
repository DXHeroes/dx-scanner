"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const utils_1 = require("../detectors/utils");
const inversify_config_1 = require("../inversify.config");
const model_1 = require("../model");
const ReporterData_1 = require("../reporters/ReporterData");
const scanner_1 = require("../scanner");
class Practices {
    static async run(cmd) {
        utils_1.debugLog('cli')(cmd);
        const scanPath = process.cwd();
        const container = inversify_config_1.createRootContainer({
            uri: scanPath,
            json: cmd.json,
            details: false,
            auth: undefined,
            ci: false,
            recursive: false,
            fail: model_1.PracticeImpact.off,
            fix: false,
            fixPattern: undefined,
            html: cmd.html,
            apiToken: undefined,
            apiUrl: 'https://provider.dxscanner.io/api/v1',
        });
        const scanner = container.get(scanner_1.Scanner);
        const practices = scanner.listPractices();
        const practicesToReport = practices.map((p) => {
            return {
                id: p.getMetadata().id,
                name: p.getMetadata().name,
                impact: p.getMetadata().impact,
                url: p.getMetadata().url,
            };
        });
        debug_1.default.log(cmd.json
            ? // print practices in JSON format
                JSON.stringify(practicesToReport, null, 2)
            : ReporterData_1.ReporterData.table(['Practice ID', 'Practice Name', 'Practice Impact', 'URL'], practicesToReport));
    }
}
exports.default = Practices;
//# sourceMappingURL=practices.js.map