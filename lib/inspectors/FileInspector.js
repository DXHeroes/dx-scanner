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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileInspector = void 0;
const inversify_1 = require("inversify");
const nodePath = __importStar(require("path"));
const utils_1 = require("../detectors/utils");
const InMemoryCache_1 = require("../scanner/cache/InMemoryCache");
const services_1 = require("../services");
const model_1 = require("../services/model");
const types_1 = require("../types");
let FileInspector = class FileInspector {
    constructor(projectFilesBrowser, basePath) {
        this.basePath = basePath && this.normalizePath(basePath);
        this.projectFilesBrowser = projectFilesBrowser;
        this.cache = new InMemoryCache_1.InMemoryCache();
    }
    purgeCache() {
        this.cache.purge();
    }
    exists(path) {
        return this.cache.getOrSet(`${this.basePath}:exists:${path}`, async () => {
            return this.projectFilesBrowser.exists(this.normalizePath(path));
        });
    }
    readDirectory(path) {
        return this.cache.getOrSet(`${this.basePath}:readDirectory:${path}`, async () => {
            return this.projectFilesBrowser.readDirectory(this.normalizePath(path));
        });
    }
    readFile(path) {
        return this.cache.getOrSet(`${this.basePath}:readFile:${path}`, async () => {
            return this.projectFilesBrowser.readFile(this.normalizePath(path));
        });
    }
    writeFile(path, data) {
        if (this.projectFilesBrowser instanceof services_1.FileSystemService) {
            return this.projectFilesBrowser.writeFile(this.normalizePath(path), data);
        }
        return Promise.resolve();
    }
    appendFile(path, data) {
        if (this.projectFilesBrowser instanceof services_1.FileSystemService) {
            return this.projectFilesBrowser.createFile(this.normalizePath(path), data);
        }
        return Promise.resolve();
    }
    isFile(path) {
        return this.cache.getOrSet(`${this.basePath}:isFile:${path}`, async () => {
            return this.projectFilesBrowser.isFile(this.normalizePath(path));
        });
    }
    isDirectory(path) {
        return this.cache.getOrSet(`${this.basePath}:isDirectory:${path}`, async () => {
            return this.projectFilesBrowser.isDirectory(this.normalizePath(path));
        });
    }
    getMetadata(path) {
        return this.cache.getOrSet(`${this.basePath}:getMetadata:${path}`, async () => {
            return this.projectFilesBrowser.getMetadata(this.normalizePath(path));
        });
    }
    flatTraverse(path, fn) {
        return this.cache.getOrSet(`${this.basePath}:flatTraverse:${path}:${fn}`, async () => {
            return this.projectFilesBrowser.flatTraverse(path, fn);
        });
    }
    normalizePath(path) {
        if (this.basePath && !path.startsWith(this.basePath)) {
            path = `${this.basePath}/${path}`;
        }
        return nodePath.normalize(nodePath.resolve(path));
    }
    async scanFor(fileName, path, options) {
        return this.cache.getOrSet(`${this.basePath}:scanFor:${fileName}:${path}:${options}`, async () => {
            path = this.normalizePath(path);
            options = options || {};
            options.ignoreSubPaths = options.ignoreSubPaths || [];
            let result = [];
            let dirContents = [];
            try {
                dirContents = await this.readDirectory(path);
            }
            catch (error) {
                if (error.code !== 'ENOENT' || (error.code === 'ENOENT' && options.ignoreErrors !== true)) {
                    throw error;
                }
            }
            utils_1.debugLog(`Scanning for ${fileName.toString()} in ${path}`);
            if (options.ignoreSubPaths) {
                options.ignoreSubPaths.forEach((pathToIgnore) => {
                    if (path.startsWith(this.normalizePath(pathToIgnore))) {
                        return result;
                    }
                });
            }
            const forbiddenDirNames = ['.git', 'node_modules'];
            // debug(dirContents);
            await Promise.all(dirContents.map(async (entry) => {
                const entryMetadata = await this.getMetadata(`${path}/${entry}`);
                if (entryMetadata.type === model_1.MetadataType.file) {
                    if (entryMetadata.name.match(fileName)) {
                        result.push(entryMetadata);
                    }
                }
                else if ((options === null || options === void 0 ? void 0 : options.shallow) !== true &&
                    entryMetadata.type === model_1.MetadataType.dir &&
                    forbiddenDirNames.indexOf(entryMetadata.name) === -1) {
                    const subResult = await this.scanFor(fileName, entryMetadata.path, options);
                    result = [...result, ...subResult];
                }
            }));
            return result;
        });
    }
};
FileInspector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IProjectFilesBrowser)),
    __param(1, inversify_1.inject(types_1.Types.FileInspectorBasePath)), __param(1, inversify_1.optional()),
    __metadata("design:paramtypes", [Object, Object])
], FileInspector);
exports.FileInspector = FileInspector;
//# sourceMappingURL=FileInspector.js.map