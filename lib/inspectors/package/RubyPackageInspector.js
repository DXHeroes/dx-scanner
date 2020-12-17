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
exports.RubyPackageInspector = void 0;
const PackageInspectorBase_1 = require("./PackageInspectorBase");
const __1 = require("..");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const semver_1 = require("semver");
let RubyPackageInspector = class RubyPackageInspector extends PackageInspectorBase_1.PackageInspectorBase {
    constructor(fileInspector) {
        super();
        this.parsedDependencies = [];
        this.fileInspector = fileInspector;
    }
    async init() {
        try {
            this.debug('RubyPackageInspector init started');
            // Remove any white lines in the string, but keep line breaks
            const gemfileString = (await this.fileInspector.readFile('Gemfile')).replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
            const gemfileLines = gemfileString.split('\n');
            const gemfilePackages = gemfileLines
                .map((line) => line.split(' '))
                .map((splitLine) => splitLine.map((part) => part.replace(/"/g, '').replace(/,/g, '')))
                .filter((splitLine) => splitLine[0] === 'gem' && splitLine[1])
                .map((splitLine) => {
                return {
                    packageName: splitLine[1],
                    version: this.parseVersion(splitLine.slice(2)),
                };
            });
            for (const parsedPackage of gemfilePackages) {
                if (parsedPackage.version) {
                    this.parsedDependencies.push({ packageName: parsedPackage.packageName, version: parsedPackage.version });
                }
            }
            this.packages = [];
            this.addPackages(this.parsedDependencies, __1.DependencyType.Runtime);
            this.debug(this.packages);
            this.debug('RubyPackageInspector init ended');
        }
        catch (e) {
            this.packages = undefined;
            this.debug(e);
        }
    }
    parseVersion(lineRemainder) {
        let highestSemVer = undefined;
        for (const lineSegment of lineRemainder) {
            if (lineSegment.startsWith('#')) {
                return highestSemVer; // begin comments, return what we have so far
            }
            const segmentSemVer = PackageInspectorBase_1.PackageInspectorBase.semverToPackageVersion(lineSegment);
            if (segmentSemVer !== undefined) {
                if (highestSemVer === undefined) {
                    highestSemVer = segmentSemVer;
                }
                else {
                    const cSegment = semver_1.coerce(segmentSemVer.value);
                    const cHighest = semver_1.coerce(highestSemVer.value);
                    if (cSegment && cHighest) {
                        if (semver_1.gte(cSegment, cHighest)) {
                            highestSemVer = segmentSemVer;
                        }
                    }
                }
            }
        }
        return highestSemVer;
    }
    addPackages(dependencies, depType) {
        if (!dependencies) {
            return;
        }
        if (!this.packages) {
            this.packages = [];
        }
        for (const dependency of dependencies) {
            if (dependency.version) {
                this.packages.push({
                    dependencyType: depType,
                    name: dependency.packageName,
                    requestedVersion: dependency.version,
                    // TODO - detect lockfileVersion from lockfile as lockfileVersion doesn't have to be the same as the requested version
                    lockfileVersion: dependency.version,
                });
            }
        }
    }
    hasLockfile() {
        return false;
    }
};
RubyPackageInspector = __decorate([
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], RubyPackageInspector);
exports.RubyPackageInspector = RubyPackageInspector;
//# sourceMappingURL=RubyPackageInspector.js.map