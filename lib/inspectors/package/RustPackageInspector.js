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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RustPackageInspector_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustPackageInspector = void 0;
const PackageInspectorBase_1 = require("./PackageInspectorBase");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const TOML = __importStar(require("@iarna/toml"));
const IPackageInspector_1 = require("../IPackageInspector");
const isRecord = (v) => {
    return typeof v === 'object' && v !== null;
};
const isString = (v) => {
    return typeof v === 'string';
};
const isOptString = (v) => {
    return typeof v === 'string' || v === undefined;
};
const isOptBool = (v) => {
    return typeof v === 'boolean' || v === undefined;
};
const isOptStringArray = (v) => {
    return v === undefined || (Array.isArray(v) && v.every((e) => typeof e === 'string'));
};
/**
 * Similar to `lodash.conformsTo` but runs the check on `undefined` instead of failing.
 */
const conformsOptional = (check, value) => {
    return Object.keys(check).every((key) => check[key](value[key]));
};
let RustPackageInspector = RustPackageInspector_1 = class RustPackageInspector extends PackageInspectorBase_1.PackageInspectorBase {
    constructor(fileInspector) {
        super();
        this.fileInspector = fileInspector;
    }
    async init() {
        try {
            this.debug('RustPackageInspector init started');
            let cargoLockString = undefined;
            try {
                cargoLockString = await this.fileInspector.readFile('Cargo.lock');
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
            if (cargoLockString !== undefined) {
                const cargoLockToml = TOML.parse(cargoLockString);
                this.cargoLock = RustPackageInspector_1.parseLock(cargoLockToml);
            }
            let cargoManifestString = undefined;
            try {
                cargoManifestString = await this.fileInspector.readFile('Cargo.toml');
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
            if (cargoManifestString !== undefined) {
                const cargoManifestToml = TOML.parse(cargoManifestString);
                if ('workspace' in cargoManifestToml) {
                    this.cargoManifest = {
                        workspace: RustPackageInspector_1.parseWorkspace(cargoManifestToml['workspace']),
                    };
                    this.packages = [];
                }
                else {
                    this.cargoManifest = Object.assign(Object.assign({ package: RustPackageInspector_1.parsePackage(cargoManifestToml['package']) }, RustPackageInspector_1.parseDependencySet(cargoManifestToml)), { target: RustPackageInspector_1.parseTarget(cargoManifestToml['target']), bin: RustPackageInspector_1.parseBin(cargoManifestToml['bin']), profile: cargoManifestToml['profile'] });
                    this.packages = RustPackageInspector_1.addPackages(this.cargoManifest, this.cargoLock);
                }
            }
            this.debug(this.cargoLock);
            this.debug(this.cargoManifest);
            this.debug('RustPackageInspector init ended');
        }
        catch (e) {
            this.packages = undefined;
            this.debug(e);
            console.error(e);
        }
    }
    hasLockfile() {
        return this.cargoLock !== undefined;
    }
    static parseWorkspace(value) {
        if (isRecord(value)) {
            const members = value['members'];
            if (Array.isArray(members) && members.every((m) => typeof m === 'string')) {
                return {
                    members,
                };
            }
        }
        throw new Error('Could not parse Cargo.toml workspace');
    }
    static parseDependency(key, value) {
        if (typeof value === 'string') {
            return {
                name: key,
                version: value,
            };
        }
        if (isRecord(value)) {
            if (conformsOptional({
                version: isOptString,
                path: isOptString,
                git: isOptString,
                branch: isOptString,
                package: isOptString,
                optional: isOptBool,
                'default-features': isOptBool,
                features: isOptStringArray,
                registry: isOptString,
            }, value)) {
                // Safe because we just checked that it conforms
                const v = value;
                v.name = key;
                return v;
            }
        }
        throw new Error(`Could not parse Cargo.toml dependency "${key}"`);
    }
    static parseDependencies(values) {
        const result = [];
        if (values === undefined) {
            return result;
        }
        if (isRecord(values)) {
            for (const key of Object.keys(values)) {
                result.push(RustPackageInspector_1.parseDependency(key, values[key]));
            }
            return result;
        }
        throw new Error('Could not parse Cargo.toml dependencies array');
    }
    static parseDependencySet(obj) {
        return {
            dependencies: RustPackageInspector_1.parseDependencies(obj['dependencies']),
            'dev-dependencies': RustPackageInspector_1.parseDependencies(obj['dev-dependencies']),
            'build-dependencies': RustPackageInspector_1.parseDependencies(obj['build-dependencies']),
        };
    }
    static parseTarget(value) {
        if (value === undefined) {
            return {};
        }
        if (isRecord(value)) {
            const result = {};
            for (const key of Object.keys(value)) {
                const target = value[key];
                if (isRecord(target)) {
                    result[key] = RustPackageInspector_1.parseDependencySet(target);
                }
            }
            return result;
        }
        console.error(value);
        throw new Error('Could not parse Cargo.toml target table');
    }
    static parseBinaryInfo(value) {
        if (isRecord(value)) {
            if (conformsOptional({
                name: isString,
                path: isString,
            }, value)) {
                // Safe because we just checked conformity
                return value;
            }
        }
        throw new Error('Could not parse Cargo.toml bin array entry');
    }
    static parseBin(value) {
        if (value === undefined) {
            return [];
        }
        if (Array.isArray(value)) {
            return value.map((e) => RustPackageInspector_1.parseBinaryInfo(e));
        }
        throw new Error('Could not parse Cargo.toml bin array');
    }
    static parsePackage(value) {
        if (isRecord(value)) {
            if (conformsOptional({
                name: isString,
                version: isString,
                authors: isOptStringArray,
                edition: (v) => v === '2015' || v === '2018',
                description: isOptString,
                documentation: isOptString,
                readme: isOptString,
                homepage: isOptString,
                repository: isOptString,
                license: isOptString,
                'license-file': isOptString,
                keywords: isOptStringArray,
                categories: isOptStringArray,
                workspace: isOptString,
                build: isOptString,
                links: isOptString,
                exclude: isOptStringArray,
                include: isOptStringArray,
                publish: (v) => typeof v === 'boolean' || isOptStringArray(v),
                metadata: (v) => v === undefined || isRecord(v),
                'default-run': isOptString,
            }, value)) {
                return value;
            }
        }
        throw new Error('Could not parse Cargo.toml package table');
    }
    static parseLockPackage(value) {
        if (isRecord(value)) {
            if (conformsOptional({
                name: isString,
                version: isString,
                source: isOptString,
                checksum: isOptString,
                dependencies: isOptStringArray,
            }, value)) {
                return value;
            }
        }
        throw new Error('Could not parse Cargo.lock package');
    }
    static parseLock(value) {
        if (isRecord(value)) {
            if (Array.isArray(value['package'])) {
                const result = {
                    package: [],
                };
                result.package.push(...value['package'].map((p) => RustPackageInspector_1.parseLockPackage(p)));
                return result;
            }
        }
        throw new Error('Could not parse Cargo.lock');
    }
    static parseSemver(version) {
        let result = undefined;
        if (version !== undefined) {
            result = PackageInspectorBase_1.PackageInspectorBase.semverToPackageVersion(version);
        }
        return (result !== null && result !== void 0 ? result : {
            value: '0.0.0',
            major: '0',
            minor: '0',
            patch: '0',
        });
    }
    static addPackages(manifest, lockFile) {
        var _a;
        const parseDep = (type, dep) => {
            var _a, _b;
            const name = (_a = dep.package) !== null && _a !== void 0 ? _a : dep.name;
            const version = RustPackageInspector_1.parseSemver(dep.version);
            const lockVersion = lockFile === undefined ? version : RustPackageInspector_1.parseSemver((_b = lockFile.package.find((p) => p.name === name)) === null || _b === void 0 ? void 0 : _b.version);
            return {
                dependencyType: type,
                name,
                requestedVersion: version,
                lockfileVersion: lockVersion,
            };
        };
        const parseRuntimeDep = parseDep.bind(undefined, IPackageInspector_1.DependencyType.Runtime);
        const parseDevDep = parseDep.bind(undefined, IPackageInspector_1.DependencyType.Dev);
        const result = [];
        result.push(...manifest.dependencies.map(parseRuntimeDep), ...manifest['dev-dependencies'].map(parseDevDep), 
        // ...manifest["build-dependencies"].map(), // TODO
        ...Object.values((_a = manifest.target) !== null && _a !== void 0 ? _a : {}).flatMap((target) => target.dependencies.map(parseRuntimeDep).concat(...target['dev-dependencies'].map(parseDevDep))));
        return result;
    }
};
RustPackageInspector = RustPackageInspector_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], RustPackageInspector);
exports.RustPackageInspector = RustPackageInspector;
//# sourceMappingURL=RustPackageInspector.js.map