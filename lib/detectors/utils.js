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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLog = exports.hasOneOfPackages = exports.sharedSubpath = exports.fileNameRegExp = exports.fileExtensionRegExp = void 0;
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const nodePath = __importStar(require("path"));
const logfile_1 = require("../lib/logfile");
exports.fileExtensionRegExp = (extensions) => {
    const regExpString = `.*\\.(${extensions.join('|').replace('.', '\\.')})$`;
    return new RegExp(regExpString, 'i');
};
exports.fileNameRegExp = (name) => {
    return new RegExp(`^${name.replace('.', '\\.')}$`, 'i');
};
/**
 * Get common prefix of all paths
 */
exports.sharedSubpath = (paths) => {
    const sep = nodePath.sep;
    paths = paths
        .concat()
        .map((p) => p.split(nodePath.posix.sep).join(sep))
        .sort();
    const firstPath = paths[0];
    const lastPath = paths[paths.length - 1];
    const isRelative = !nodePath.isAbsolute(firstPath);
    if (lastPath.startsWith(sep) && isRelative)
        return sep;
    const firstPathSplit = firstPath.split(sep).filter((p) => p !== '' && p !== '.');
    const lastPathSplit = lastPath.split(sep).filter((p) => p !== '' && p !== '.');
    const length = firstPathSplit.length;
    let i = 0;
    while (i < length && firstPathSplit[i] === lastPathSplit[i]) {
        i++;
    }
    return `${isRelative ? `.${sep}` : sep}${firstPathSplit.slice(0, i).join(sep)}`;
};
exports.hasOneOfPackages = (packages, packageManagement) => {
    if (!packageManagement) {
        return false;
    }
    if (lodash_1.intersection(lodash_1.keys(packageManagement.packages), packages).length > 0) {
        return true;
    }
    return false;
};
exports.debugLog = (namespace) => {
    return (...args) => {
        const d = debug_1.default(namespace);
        if (args.length > 0) {
            d('', ...args);
        }
        logfile_1.logfile.log(namespace, ...args);
    };
};
//# sourceMappingURL=utils.js.map