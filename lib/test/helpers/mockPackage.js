"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPackage = void 0;
const IPackageInspector_1 = require("../../inspectors/IPackageInspector");
exports.mockPackage = (name, value = '1.0.0', dependencyType = IPackageInspector_1.DependencyType.Runtime) => {
    const values = value.split('.');
    const major = values[0];
    const minor = values[1] || '0';
    const patch = values[2] || '0';
    const ctx = {
        name: name,
        requestedVersion: {
            value: value,
            major: major,
            minor: minor,
            patch: patch,
        },
        lockfileVersion: {
            value: value,
            major: major,
            minor: minor,
            patch: patch,
        },
        dependencyType: dependencyType,
    };
    return ctx;
};
//# sourceMappingURL=mockPackage.js.map