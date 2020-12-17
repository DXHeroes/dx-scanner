"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageManagerType = exports.PackageManagerUtils = void 0;
const command_exists_1 = require("command-exists");
const shelljs_1 = __importDefault(require("shelljs"));
class PackageManagerUtils {
}
exports.PackageManagerUtils = PackageManagerUtils;
/** Guess the package manager by lockfiles and shrinkfile */
PackageManagerUtils.getPackageManager = async (fileInspector) => {
    if (!fileInspector)
        return PackageManagerType.unknown;
    const packageLockExists = await fileInspector.exists('./package-lock.json');
    if (packageLockExists)
        return PackageManagerType.npm;
    const shrinkwrapExists = await fileInspector.exists('./npm-shrinkwrap.json');
    if (shrinkwrapExists)
        return PackageManagerType.npm;
    const yarnLockExists = await fileInspector.exists('./yarn.lock');
    if (yarnLockExists)
        return PackageManagerType.yarn;
    return PackageManagerType.unknown;
};
/** Checks if the provided package manager is installed and fallback if possible */
PackageManagerUtils.packageManagerInstalled = (packageManager) => {
    const hasNpm = command_exists_1.sync('npm');
    const hasYarn = command_exists_1.sync('yarn');
    if (packageManager === PackageManagerType.yarn) {
        if (hasYarn)
            return packageManager;
        else if (hasNpm) {
            // fallback from yarn to npm
            packageManager = PackageManagerType.npm;
        }
    }
    if (packageManager === PackageManagerType.npm && hasNpm)
        return packageManager;
    return PackageManagerType.unknown;
};
/** Guess the package manager by lockfiles and then checks if its installed. Fallback if possible */
PackageManagerUtils.getPackageManagerInstalled = async (fileInspector) => {
    const pm = await PackageManagerUtils.getPackageManager(fileInspector);
    return PackageManagerUtils.packageManagerInstalled(pm);
};
PackageManagerUtils.installPackage = async (fileInspector, packageName, options = { dev: false }) => {
    const pm = await PackageManagerUtils.getPackageManagerInstalled(fileInspector);
    if (pm === PackageManagerType.npm) {
        shelljs_1.default.exec(`npm i ${options.dev ? '-D' : ''} --prefix ${fileInspector.basePath} ${packageName}`);
    }
    else if (pm === PackageManagerType.yarn) {
        shelljs_1.default.exec(`yarn add ${options.dev ? '-D' : ''} --cwd ${fileInspector.basePath} ${packageName}`);
    }
};
var PackageManagerType;
(function (PackageManagerType) {
    PackageManagerType["unknown"] = "unknown";
    PackageManagerType["npm"] = "npm";
    PackageManagerType["yarn"] = "yarn";
})(PackageManagerType = exports.PackageManagerType || (exports.PackageManagerType = {}));
//# sourceMappingURL=PackageManagerUtils.js.map