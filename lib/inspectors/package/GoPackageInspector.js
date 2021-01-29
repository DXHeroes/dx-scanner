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
exports.GoPackageInspector = void 0;
const PackageInspectorBase_1 = require("./PackageInspectorBase");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const IPackageInspector_1 = require("../IPackageInspector");
let GoPackageInspector = class GoPackageInspector extends PackageInspectorBase_1.PackageInspectorBase {
    constructor(fileInspector) {
        super();
        this.fileInspector = fileInspector;
    }
    async init() {
        try {
            this.debug('GoPkgInspector init started');
            this.hasLockfileFile = await this.fileInspector.exists('go.sum');
            // read the requirements file and remove any white lines in the string, but keep line breaks
            const goModString = (await this.fileInspector.readFile('go.mod')).replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
            this.packages = [];
            const pkgs = this.resolveGoModString(goModString);
            this.addPkgs(pkgs, IPackageInspector_1.DependencyType.Runtime);
            this.debug('GoPkgInspector init ended');
        }
        catch (e) {
            this.packages = undefined;
            this.debug(e);
        }
    }
    hasLockfile() {
        return this.hasLockfileFile;
    }
    addPkgs(pkgs, depType) {
        if (!pkgs) {
            return;
        }
        if (!this.packages) {
            this.packages = [];
        }
        for (const pkg of pkgs) {
            let parsedVersion = {
                value: '',
                major: '',
                minor: '',
                patch: '',
            };
            if (!pkg.version) {
                return;
            }
            if (pkg.version.includes('-')) {
                pkg.version = pkg.version.split('-')[0];
                parsedVersion = PackageInspectorBase_1.PackageInspectorBase.semverToPackageVersion(pkg.version);
            }
            pkg.version = pkg.version.slice(1, pkg.version.length);
            parsedVersion = PackageInspectorBase_1.PackageInspectorBase.semverToPackageVersion(pkg.version);
            if (parsedVersion) {
                this.packages.push({
                    dependencyType: depType,
                    name: pkg.name,
                    requestedVersion: parsedVersion,
                    lockfileVersion: parsedVersion,
                });
            }
        }
    }
    resolveGoModString(goModString) {
        if (!this.goMod) {
            this.goMod = {
                name: '',
                goVersion: '',
            };
        }
        const pkgs = [];
        const lines = goModString.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const l = lines[i];
            if (i === 0) {
                this.goMod.name = l.split(' ')[1];
            }
            else if (i === 1) {
                this.goMod.goVersion = l.split(' ')[1];
            }
            else {
                if (l.endsWith('require')) {
                    const pkgver = l.split(' ');
                    pkgs.push({
                        name: pkgver[1],
                        version: pkgver[2],
                    });
                    return pkgs;
                }
                else if (l.endsWith('require (') || l.endsWith(')')) {
                    continue;
                }
                else {
                    const pkgver = l.split(' ');
                    if (pkgver.length > 1) {
                        pkgs.push({
                            name: pkgver[0],
                            version: pkgver[1],
                        });
                    }
                }
            }
        }
        return pkgs;
    }
};
GoPackageInspector = __decorate([
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], GoPackageInspector);
exports.GoPackageInspector = GoPackageInspector;
//# sourceMappingURL=GoPackageInspector.js.map