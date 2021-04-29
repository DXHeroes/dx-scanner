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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustComponentDetector = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const model_1 = require("../../model");
const inspectors_1 = require("../../inspectors");
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const errors_1 = require("../../lib/errors");
let RustComponentDetector = class RustComponentDetector {
    constructor(packageInspector, fileInspector) {
        this.packageInspector = packageInspector;
        this.fileInspector = fileInspector;
    }
    async detectComponent(langAtPath) {
        const result = [];
        // Cargo outputs a binary output when it finds:
        // * `src/main.rs`
        // * `src/bin/*.rs`
        // * `src/bin/*/main.rs`
        // * a `bin` entry in the manifest
        const hasMain = await this.fileInspector.exists(path_1.default.join('src', 'main.rs'));
        let hasSrcBin = false;
        try {
            const binFolderEntries = await this.fileInspector.readDirectory(path_1.default.join('src', 'bin'));
            for (const entry of binFolderEntries) {
                const entryPath = path_1.default.join('src', 'bin', entry);
                const isRsFile = entry.endsWith('.rs') && (await this.fileInspector.isFile(entryPath));
                if (isRsFile) {
                    hasSrcBin = true;
                    break;
                }
                const hasNestedMain = await this.fileInspector.isFile(path_1.default.join(entryPath, 'main.rs'));
                if (hasNestedMain) {
                    hasSrcBin = true;
                    break;
                }
            }
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                // ignore
            }
            else {
                throw e;
            }
        }
        const hasManifestBin = lodash_1.default.get(this.packageInspector.cargoManifest, 'bin.length', 0) > 0;
        const hasBinaryFile = hasMain || hasSrcBin || hasManifestBin;
        // Cargo outputs a library if and only if `src/lib.rs` exists
        const hasLib = await this.fileInspector.exists(path_1.default.join('src', 'lib.rs'));
        if (hasLib) {
            result.push({
                framework: model_1.ProjectComponentFramework.UNKNOWN,
                language: langAtPath.language,
                path: langAtPath.path,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                repositoryPath: undefined,
                type: model_1.ProjectComponentType.Library,
            });
        }
        if (hasBinaryFile) {
            result.push({
                framework: model_1.ProjectComponentFramework.UNKNOWN,
                language: langAtPath.language,
                path: langAtPath.path,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                repositoryPath: undefined,
                type: model_1.ProjectComponentType.Application,
            });
        }
        if (result.length === 0) {
            throw errors_1.ErrorFactory.newInternalError(`Could not detect neither a library nor a binary Rust crate at given language path: ${langAtPath.path}`);
        }
        return result;
    }
};
RustComponentDetector = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [inspectors_1.RustPackageInspector, Object])
], RustComponentDetector);
exports.RustComponentDetector = RustComponentDetector;
//# sourceMappingURL=RustComponentDetector.js.map