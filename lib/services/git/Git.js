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
exports.Git = void 0;
const inversify_1 = require("inversify");
const nodePath = __importStar(require("path"));
const ICollaborationInspector_1 = require("../../inspectors/ICollaborationInspector");
const ErrorFactory_1 = require("../../lib/errors/ErrorFactory");
const types_1 = require("../../types");
const model_1 = require("../model");
const GitServiceUtils_1 = require("./GitServiceUtils");
let Git = class Git {
    constructor(repository, service) {
        this.repository = repository;
        this.service = service;
    }
    async exists(path) {
        const result = await this.getRepoContent(await this.followSymLinks(path));
        return result !== null;
    }
    async readDirectory(path) {
        const result = await this.getRepoContent(await this.followSymLinks(path));
        if (result !== null && Array.isArray(result)) {
            return result.map((item) => item.name);
        }
        else {
            throw ErrorFactory_1.ErrorFactory.newInternalError(`${path} is not a directory`);
        }
    }
    async readFile(path) {
        let result = await this.getRepoContent(await this.followSymLinks(path));
        if (result !== null && !Array.isArray(result)) {
            result = result;
            if (!result.content)
                return '';
            return Buffer.from(result.content, result.encoding).toString('utf-8');
        }
        else {
            throw ErrorFactory_1.ErrorFactory.newInternalError(`${path} is not a file`);
        }
    }
    async isFile(path) {
        const result = await this.getRepoContent(await this.followSymLinks(path));
        if (result === null) {
            throw ErrorFactory_1.ErrorFactory.newInternalError(`Could not get content of ${path}`);
        }
        return !Array.isArray(result);
    }
    async isDirectory(path) {
        const result = await this.getRepoContent(await this.followSymLinks(path));
        if (result === null) {
            throw ErrorFactory_1.ErrorFactory.newInternalError(`Could not get content of ${path}`);
        }
        return Array.isArray(result);
    }
    async getMetadata(path) {
        let extension = nodePath.posix.extname(path);
        const result = await this.getRepoContent(await this.followSymLinks(path));
        const name = nodePath.posix.basename(path);
        const baseName = nodePath.posix.basename(path, extension);
        extension = extension === '' ? undefined : extension;
        if (result === null) {
            throw ErrorFactory_1.ErrorFactory.newInternalError(`Could not get content of ${path}`);
        }
        if (Array.isArray(result)) {
            return {
                path,
                name,
                baseName,
                type: model_1.MetadataType.dir,
                size: 0,
                extension: undefined,
            };
        }
        return {
            path,
            name,
            baseName,
            type: model_1.MetadataType.file,
            size: result.size,
            extension,
        };
    }
    async flatTraverse(path, fn) {
        const dirContent = await this.readDirectory(path);
        await Promise.all(dirContent.map(async (cnt) => {
            const absolutePath = nodePath.posix.join(path, cnt);
            const metadata = await this.getMetadata(absolutePath);
            const lambdaResult = fn(metadata);
            if (lambdaResult === false)
                return Promise.reject(false);
            if (metadata.type === model_1.MetadataType.dir) {
                return this.flatTraverse(metadata.path, fn);
            }
        }));
    }
    async getContributorCount() {
        const params = GitServiceUtils_1.GitServiceUtils.parseUrl(this.repository.url);
        return this.service.listContributors(params.owner, params.repoName).then((r) => r.length);
    }
    async getPullRequestCount() {
        const params = GitServiceUtils_1.GitServiceUtils.parseUrl(this.repository.url);
        return this.service.listPullRequests(params.owner, params.repoName, { filter: { state: ICollaborationInspector_1.PullRequestState.all } }).then((r) => {
            if (!r) {
                throw ErrorFactory_1.ErrorFactory.newInternalError('Could not get pull requests');
            }
            return r.totalCount;
        });
    }
    getRepoContent(path) {
        const params = GitServiceUtils_1.GitServiceUtils.parseUrl(this.repository.url);
        return this.service.getRepoContent(params.owner, params.repoName, path);
    }
    async followSymLinks(path, directory) {
        directory = directory !== undefined ? directory : '';
        let name;
        path = nodePath.posix.normalize(path);
        // In case of an absolute path, name should be the root including the path separator
        name = nodePath.posix.isAbsolute(path) ? nodePath.posix.parse(path).root : path.split(nodePath.posix.sep)[0];
        path = nodePath.posix.relative(name, path);
        const child = await this.getRepoContent(nodePath.posix.join(directory, name));
        if (child !== null) {
            if (Array.isArray(child)) {
                if (path.length !== 0) {
                    path = await this.followSymLinks(path, nodePath.posix.join(directory, name));
                }
            }
            else {
                switch (child.type) {
                    case 'file':
                        break;
                    case 'symlink':
                        path = await this.followSymLinks(nodePath.posix.join(child.target, path), directory);
                        name = '';
                        break;
                }
            }
        }
        return nodePath.posix.join(name, path);
    }
};
Git = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(types_1.Types.IContentRepositoryBrowser)),
    __metadata("design:paramtypes", [Object, Object])
], Git);
exports.Git = Git;
//# sourceMappingURL=Git.js.map