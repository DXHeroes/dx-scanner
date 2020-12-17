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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemverLevel = exports.PackageInspectorBase = void 0;
const debug_1 = require("debug");
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
const semver_1 = require("semver");
let PackageInspectorBase = class PackageInspectorBase {
    constructor() {
        this.debug = debug_1.debug('package-inspector');
    }
    hasPackageManagement() {
        return Array.isArray(this.packages);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findPackages(searchTerm) {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasPackage(name, options) {
        if (!this.packages) {
            return false;
        }
        for (const pkg of this.packages) {
            if (typeof name === 'string') {
                if (pkg.name.toLowerCase() === name.toLowerCase()) {
                    return true;
                }
            }
            else {
                if (name.test(pkg.name.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    }
    hasOneOfPackages(packages) {
        if (!this.packages) {
            return false;
        }
        if (lodash_1.intersection(this.packages.map((p) => p.name), packages).length > 0) {
            return true;
        }
        return false;
    }
    findPackage(name, options) {
        if (options) {
            throw new Error('Options not implemented.');
        }
        if (!this.packages) {
            return undefined;
        }
        for (const pkg of this.packages) {
            if (pkg.name.toLowerCase() === name.toLowerCase()) {
                return pkg;
            }
        }
        return undefined;
    }
    static semverToPackageVersion(semverString) {
        const coerced = semver_1.coerce(semverString);
        if (coerced) {
            const version = semver_1.valid(coerced);
            if (version) {
                const splitted = version.split('.');
                return {
                    value: semverString,
                    major: splitted[0],
                    minor: splitted[1],
                    patch: splitted[2],
                };
            }
        }
        return undefined;
    }
};
PackageInspectorBase = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PackageInspectorBase);
exports.PackageInspectorBase = PackageInspectorBase;
var SemverLevel;
(function (SemverLevel) {
    SemverLevel["major"] = "major";
    SemverLevel["minor"] = "minor";
    SemverLevel["patch"] = "patch";
})(SemverLevel = exports.SemverLevel || (exports.SemverLevel = {}));
//# sourceMappingURL=PackageInspectorBase.js.map