"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-process-env */
require("reflect-metadata");
const cli_ux_1 = __importDefault(require("cli-ux"));
const debug_1 = __importDefault(require("debug"));
const command_exists_1 = require("command-exists");
const inversify_config_1 = require("../inversify.config");
const scanner_1 = require("../scanner");
const ErrorFactory_1 = require("../lib/errors/ErrorFactory");
class Run {
    static async run(path = process.cwd(), cmd) {
        if (!command_exists_1.sync('git')) {
            cli_ux_1.default.warn("'git' command dependency not installed. See https://git-scm.com/book/en/v2/Getting-Started-Installing-Git for installation instructions");
            return;
        }
        debug_1.default('cli')(cmd);
        const scanPath = path;
        const { json, details, fail } = cmd;
        let { authorization } = cmd;
        const { apiToken, apiUrl } = cmd;
        const hrstart = process.hrtime();
        cli_ux_1.default.action.start(`Scanning URI: ${scanPath}`);
        const container = inversify_config_1.createRootContainer({
            uri: scanPath,
            auth: authorization,
            json,
            details,
            fail,
            recursive: cmd.recursive,
            ci: cmd.ci,
            fix: cmd.fix,
            fixPattern: cmd.fixPattern,
            html: cmd.html,
            apiToken,
            apiUrl,
        });
        const scanner = container.get(scanner_1.Scanner);
        let scanResult = await scanner.scan();
        // needsAuth and cmd.ci are both true if the credentials are invalid either due to 401 or 403
        if (scanResult.needsAuth && cmd.ci) {
            throw ErrorFactory_1.ErrorFactory.newAuthorizationError('Invalid Authorization Credentials!');
        }
        if (scanResult.needsAuth && !cmd.ci) {
            if (scanResult.isOnline) {
                authorization = await scanner_1.ScannerUtils.promptAuthorization(scanPath, scanResult);
            }
            const container = inversify_config_1.createRootContainer({
                uri: scanPath,
                auth: authorization,
                json,
                details,
                fail,
                recursive: cmd.recursive,
                ci: cmd.ci,
                fix: cmd.fix,
                fixPattern: cmd.fixPattern,
                html: cmd.html,
                apiToken,
                apiUrl,
            });
            const scanner = container.get(scanner_1.Scanner);
            scanResult = await scanner.scan({ determineRemote: false });
        }
        cli_ux_1.default.action.stop();
        const hrend = process.hrtime(hrstart);
        console.info('Scan duration %ds.', hrend[0]);
        console.log({ scanResult });
        console.log({ cmd });
        console.log(scanResult.shouldExitOnEnd);
        console.log(cmd.ci);
        if (scanResult.shouldExitOnEnd) {
            process.exit(cmd.ci ? 0 : 1);
        }
    }
}
exports.default = Run;
//# sourceMappingURL=run.js.map