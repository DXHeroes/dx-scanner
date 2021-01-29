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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const fs_1 = __importDefault(require("fs"));
const nodePath = __importStar(require("path"));
const inversify_1 = require("inversify");
const model_1 = require("./model");
const memfs_1 = require("memfs");
const volume_1 = require("memfs/lib/volume");
const errors_1 = require("../lib/errors");
/**
 * Service for file system browsing
 *  - uses fs by default
 *  - can work just in memory with memfs
 */
let FileSystemService = class FileSystemService {
    constructor({ isVirtual = false } = {}) {
        if (!isVirtual) {
            this.fileSystem = fs_1.default;
            this.virtualVolume = undefined;
        }
        else {
            this.virtualVolume = new volume_1.Volume();
            this.fileSystem = memfs_1.createFsFromVolume(this.virtualVolume);
        }
    }
    setFileSystem(structure) {
        if (!this.virtualVolume)
            throw errors_1.ErrorFactory.newInternalError('No virtual volume set');
        this.clearFileSystem();
        this.virtualVolume.fromJSON(structure);
    }
    clearFileSystem() {
        if (!this.virtualVolume)
            throw errors_1.ErrorFactory.newInternalError('No virtual volume set');
        this.virtualVolume.reset();
    }
    async exists(path) {
        try {
            await this.fileSystem.promises.lstat(path);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    readDirectory(path) {
        // <typeof fs> is small hack because TS thinks
        //   that it's different interface by default
        return this.fileSystem.promises.readdir(path);
    }
    readFile(path) {
        return this.fileSystem.promises.readFile(path, 'utf-8');
    }
    writeFile(path, content) {
        return this.fileSystem.promises.writeFile(path, content);
    }
    createDirectory(path) {
        return this.fileSystem.promises.mkdir(path);
    }
    deleteDirectory(path) {
        return this.fileSystem.promises.rmdir(path);
    }
    createFile(path, data) {
        return this.fileSystem.promises.appendFile(path, data);
    }
    deleteFile(path) {
        return this.fileSystem.promises.unlink(path);
    }
    async isFile(path) {
        const stats = await this.fileSystem.promises.lstat(path);
        return stats.isFile();
    }
    async isDirectory(path) {
        const stats = await this.fileSystem.promises.lstat(path);
        return stats.isDirectory();
    }
    async getMetadata(path) {
        const extension = nodePath.extname(path);
        const stats = await this.fileSystem.promises.lstat(path);
        const metadata = {
            path,
            name: nodePath.basename(path),
            baseName: nodePath.basename(path, extension),
            extension: extension === '' ? undefined : extension,
            //return size in bytes
            size: stats.size,
        };
        if (await this.isDirectory(path)) {
            return Object.assign(Object.assign({}, metadata), { extension: undefined, type: model_1.MetadataType.dir });
        }
        return Object.assign(Object.assign({}, metadata), { type: model_1.MetadataType.file });
    }
    async flatTraverse(path, fn) {
        const dirContent = await this.readDirectory(path);
        await Promise.all(dirContent.map(async (cnt) => {
            const absolutePath = nodePath.resolve(path, cnt);
            const metadata = await this.getMetadata(absolutePath);
            const lambdaResult = fn(metadata);
            if (lambdaResult === false)
                return Promise.reject(false);
            if (metadata.type === model_1.MetadataType.dir)
                return this.flatTraverse(metadata.path, fn);
        }));
    }
};
FileSystemService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Object])
], FileSystemService);
exports.FileSystemService = FileSystemService;
//# sourceMappingURL=FileSystemService.js.map