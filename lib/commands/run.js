"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-process-env */
const cli_ux_1 = __importDefault(require("cli-ux"));
const command_exists_1 = require("command-exists");
require("reflect-metadata");
const utils_1 = require("../detectors/utils");
const inversify_config_1 = require("../inversify.config");
const ErrorFactory_1 = require("../lib/errors/ErrorFactory");
const logfile_1 = require("../lib/logfile");
const scanner_1 = require("../scanner");
class Run {
    static async run(path = process.cwd(), cmd) {
        if (!command_exists_1.sync('git')) {
            const msg = "'git' command dependency not installed. See https://git-scm.com/book/en/v2/Getting-Started-Installing-Git for installation instructions";
            cli_ux_1.default.warn(msg);
            logfile_1.logfile.log('warning: ' + msg);
            return;
        }
        logfile_1.logfile.getSecrets(cmd.authorization, cmd.apiToken);
        utils_1.debugLog('cli')(cmd);
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
        const msg = `Scan duration ${hrend[0]}s.`;
        logfile_1.logfile.log(msg);
        cli_ux_1.default.log(msg);
        console.log({ scanResult });
        console.log({ cmd });
        console.log(scanResult.shouldExitOnEnd);
        console.log(cmd.ci);
        if (scanResult.shouldExitOnEnd) {
            process.exit(cmd.ci ? 0 : 1); // could be written as +!cmd.ci but I'm not here to show off
        }
    }
}
exports.default = Run;
//# sourceMappingURL=run.js.map