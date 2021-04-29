"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableLogfile = exports.logfile = exports.Logfile = void 0;
const debug_1 = __importDefault(require("debug"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
class Logfile {
    constructor() {
        this.enabled = false;
        this.fname = path_1.default.join(process.cwd(), `dxscanner${Date.now()}.log`);
        this.file = null;
        this.authorization;
        this.apiToken;
    }
    /**
     * Get secrets to be redacted.
     * @param authorization
     * @param apiToken
     */
    getSecrets(authorization, apiToken) {
        (this.authorization = authorization), (this.apiToken = apiToken);
    }
    /**
     * Writes the given string to the log file.
     * @param {*} content The string to write
     * @memberof LogFile
     */
    write(content) {
        if (!this.enabled)
            return;
        if (this.file === null) {
            this.file = fs_1.default.openSync(this.fname, 'w');
            process.on('exit', () => {
                if (typeof this.file === 'number') {
                    fs_1.default.closeSync(this.file);
                }
            });
        }
        if (this.apiToken)
            content = content.replace(new RegExp(this.apiToken, 'g'), '[REDACTED]');
        if (this.authorization)
            content = content.replace(new RegExp(this.authorization, 'g'), '[REDACTED]');
        fs_1.default.write(this.file, content, () => { });
    }
    /**
     * Writes the given value to the log file, followed by a newline.
     * @param {*} args The values to write
     * @memberof LogFile
     */
    log(format, ...args) {
        this.write(util_1.default.format(format, ...args) + '\n');
    }
}
exports.Logfile = Logfile;
/**
 * The Logfile instance, contains methods for writing to the logfile directly
 */
exports.logfile = new Logfile();
/**
 * Enables the logfile methods and
 * intercepts calls to `debug` to also write to `dxscanner.log`
 */
function enableLogfile() {
    exports.logfile.enabled = true;
    const removeANSIPattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
    ].join('|');
    const removeANSIRe = new RegExp(removeANSIPattern, 'g');
    const removeANSI = (s) => s.replace(removeANSIRe, '');
    debug_1.default.log = function (...args) {
        const formatted = util_1.default.format(args[0], ...args.slice(1)) + '\n';
        exports.logfile.write(removeANSI(formatted));
        process.stderr.write(formatted);
    };
}
exports.enableLogfile = enableLogfile;
//# sourceMappingURL=logfile.js.map