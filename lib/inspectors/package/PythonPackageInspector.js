"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonPackageInspector = void 0;
const PackageInspectorBase_1 = require("./PackageInspectorBase");
const __1 = require("..");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
let PythonPackageInspector = class PythonPackageInspector extends PackageInspectorBase_1.PackageInspectorBase {
    constructor(fileInspector) {
        super();
        this.parsedDependencies = [];
        this.fileInspector = fileInspector;
    }
    async init() {
        try {
            this.debug('PythonPackageInspector init started');
            // read the requirements file and remove any white lines in the string, but keep line breaks
            const requirementsFile = (await this.fileInspector.readFile('requirements.txt')).replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
            const pipVersionedPackages = requirementsFile.split('\n');
            for (const versionedPackage of pipVersionedPackages) {
                // remove white spaces in the line
                const adjustedVersionedPackage = versionedPackage.replace(/\s/g, '');
                if (adjustedVersionedPackage !== '' || !adjustedVersionedPackage) {
                    const nameAndVersion = adjustedVersionedPackage.includes('==')
                        ? adjustedVersionedPackage.split('==')
                        : adjustedVersionedPackage.split('>=');
                    this.parsedDependencies.push({ packageName: nameAndVersion[0], version: nameAndVersion[1] });
                }
            }
            this.packages = [];
            this.addPackages(this.parsedDependencies, __1.DependencyType.Runtime);
            this.debug(this.packages);
            this.debug('PythonPackageInspector init ended');
        }
        catch (e) {
            this.packages = undefined;
            this.debug(e);
        }
    }
    addPackages(dependencies, depType) {
        if (!dependencies) {
            return;
        }
        if (!this.packages) {
            this.packages = [];
        }
        for (const dependency of dependencies) {
            const parsedVersion = PackageInspectorBase_1.PackageInspectorBase.semverToPackageVersion(dependency.version);
            if (parsedVersion) {
                this.packages.push({
                    dependencyType: depType,
                    name: dependency.packageName,
                    requestedVersion: parsedVersion,
                    lockfileVersion: parsedVersion,
                });
            }
        }
    }
    hasLockfile() {
        return false;
    }
};
PythonPackageInspector = __decorate([
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], PythonPackageInspector);
exports.PythonPackageInspector = PythonPackageInspector;
//# sourceMappingURL=PythonPackageInspector.js.map