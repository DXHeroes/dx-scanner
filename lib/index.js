"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectComponentType = exports.ProjectComponentFramework = exports.ProjectComponentPlatform = exports.ProgrammingLanguage = exports.ServiceType = void 0;
/* eslint-disable no-process-env */
require("reflect-metadata");
const commander = __importStar(require("commander"));
const run_1 = __importDefault(require("./commands/run"));
const model_1 = require("./model");
const init_1 = __importDefault(require("./commands/init"));
const practices_1 = __importDefault(require("./commands/practices"));
const lodash_1 = __importDefault(require("lodash"));
const update_notifier_1 = __importDefault(require("update-notifier"));
const errors_1 = require("./lib/errors");
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pjson = require('../package.json');
class DXScannerCommand {
    static async run() {
        const cmder = new commander.Command();
        // default cmd config
        cmder
            .version(pjson.version)
            .name('dx-scanner')
            .usage('[command] [options] ')
            .on('--help', () => {
            console.log('');
            console.log('Aliases:');
            console.log('  dxs');
            console.log('  dxscanner');
        });
        // cmd: run
        cmder
            .command('run [path]')
            //customize default help
            .usage('[path] [options]')
            .description('Scan your project for possible DX recommendations')
            .option('-a --authorization <authorization>', 'credentials to the repository (in format "token" or "username:token"; can be set as ENV variable DXSCANNER_GIT_SERVICE_TOKEN)', process.env.DXSCANNER_GIT_SERVICE_TOKEN || process.env.GITHUB_TOKEN)
            .option('-t --apiToken <apiToken>', 'credentials to DX Scanner, can be set as ENV variable DXSCANNER_API_TOKEN', process.env.DXSCANNER_API_TOKEN)
            .option('--apiUrl <apiUrl>', 'URL of DX Scanner API, can be set as ENV variable DXSCANNER_API_URL', process.env.DXSCANNER_API_URL || 'https://provider.dxscanner.io/api/v1')
            .option('--ci', 'CI mode', process.env.CI === 'true')
            .option('-d --details', 'print details in reports')
            .option('--fail <impact>', `exits process with code 1 for any non-practicing condition of given level (${Object.keys(model_1.PracticeImpact)
            .concat('all')
            .join('|')})`, this.validateFailInput, model_1.PracticeImpact.high)
            .option('--fix', 'tries to fix problems automatically', false)
            .option('--fixPattern <pattern>', 'fix only rules with IDs matching the regex')
            .option('-j --json', 'print report in JSON', false)
            .option('--html [path]', 'save report in HTML', false)
            .option('-r --recursive', 'scan all components recursively in all sub folders', false)
            .action(run_1.default.run)
            .on('--help', () => {
            console.log('');
            console.log('Examples:');
            console.log('  dx-scanner run');
            console.log('  dx-scanner run . --fail=high');
            console.log('  dx-scanner run github.com/DXHeroes/dx-scanner');
        });
        // cmd: init
        cmder.command('init').description('Initialize DX Scanner configuration').action(init_1.default.run);
        // cmd: practices
        cmder
            .command('practices')
            .description('List all practices id with name and impact')
            .option('-j --json', 'print practices in JSON')
            .action(practices_1.default.run);
        await cmder.parseAsync(process.argv);
        this.notifyUpdate();
    }
}
DXScannerCommand.validateFailInput = (value) => {
    if (value && !lodash_1.default.includes(model_1.PracticeImpact, value)) {
        console.error('Invalid value for --fail: %s\nValid values are: %s\n', value, Object.keys(model_1.PracticeImpact).concat('all').join(', '));
        process.exit(1);
    }
    return value;
};
DXScannerCommand.notifyUpdate = () => {
    update_notifier_1.default({ pkg: pjson, updateCheckInterval: 0, shouldNotifyInNpmScript: true }).notify();
};
process.on('uncaughtException', errors_1.errorHandler);
exports.default = DXScannerCommand;
__exportStar(require("./reporters/DashboardReporter"), exports);
var detectors_1 = require("./detectors");
Object.defineProperty(exports, "ServiceType", { enumerable: true, get: function () { return detectors_1.ServiceType; } });
var model_2 = require("./model");
Object.defineProperty(exports, "ProgrammingLanguage", { enumerable: true, get: function () { return model_2.ProgrammingLanguage; } });
Object.defineProperty(exports, "ProjectComponentPlatform", { enumerable: true, get: function () { return model_2.ProjectComponentPlatform; } });
Object.defineProperty(exports, "ProjectComponentFramework", { enumerable: true, get: function () { return model_2.ProjectComponentFramework; } });
Object.defineProperty(exports, "ProjectComponentType", { enumerable: true, get: function () { return model_2.ProjectComponentType; } });
//# sourceMappingURL=index.js.map