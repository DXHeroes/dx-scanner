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
exports.PHPPackageInspector = void 0;
const PackageInspectorBase_1 = require("./PackageInspectorBase");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const lodash_1 = require("lodash");
const IPackageInspector_1 = require("../IPackageInspector");
let PHPPackageInspector = class PHPPackageInspector extends PackageInspectorBase_1.PackageInspectorBase {
    constructor(fileInspector) {
        super();
        this.fileInspector = fileInspector;
    }
    async init() {
        try {
            this.debug('PHPPackageInspector init started');
            const composerJsonString = await this.fileInspector.readFile('composer.json');
            this.hasLockfileFile = await this.fileInspector.exists('composer.lock');
            this.composerJson = JSON.parse(composerJsonString.replace(/\\/g, '/'));
            this.packages = [];
            this.addPackages(this.composerJson.require, IPackageInspector_1.DependencyType.Runtime);
            // 'require-dev' must be in kebab-case
            this.addPackages(this.composerJson['require-dev'], IPackageInspector_1.DependencyType.Dev);
            this.debug(this.composerJson);
            this.debug(this.packages);
            this.debug('PHPPackageInspector init ended');
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
        for (const packageName of lodash_1.keys(dependencies)) {
            const packageVersion = dependencies[packageName];
            const parsedVersion = PackageInspectorBase_1.PackageInspectorBase.semverToPackageVersion(packageVersion);
            if (!this.packages) {
                this.packages = [];
            }
            if (parsedVersion) {
                //TODO: Also work with lockfileVersions
                this.packages.push({
                    dependencyType: depType,
                    name: packageName,
                    requestedVersion: parsedVersion,
                    lockfileVersion: parsedVersion,
                });
            }
        }
    }
    hasLockfile() {
        return this.hasLockfileFile;
    }
};
PHPPackageInspector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], PHPPackageInspector);
exports.PHPPackageInspector = PHPPackageInspector;
//# sourceMappingURL=PHPPackageInspector.js.map