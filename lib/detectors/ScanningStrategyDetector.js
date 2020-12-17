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
exports.ScanningStrategyDetector = void 0;
const debug_1 = __importDefault(require("debug"));
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
const services_1 = require("../services");
const GitLabService_1 = require("../services/gitlab/GitLabService");
const types_1 = require("../types");
const ScanningStrategyDetectorUtils_1 = require("./utils/ScanningStrategyDetectorUtils");
const errors_1 = require("../lib/errors");
const IScanningStrategy_1 = require("./IScanningStrategy");
const promise_1 = __importDefault(require("simple-git/promise"));
const path_1 = __importDefault(require("path"));
let ScanningStrategyDetector = class ScanningStrategyDetector {
    constructor(gitHubService, bitbucketService, gitLabService, argumentsProvider, repositoryConfig) {
        this.isOnline = false;
        this.determineInputType = async (path) => {
            if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitHubPath(path))
                return IScanningStrategy_1.ServiceType.github;
            if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isBitbucketPath(path))
                return IScanningStrategy_1.ServiceType.bitbucket;
            if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitLabPath(path))
                return IScanningStrategy_1.ServiceType.gitlab;
            if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath(path))
                return IScanningStrategy_1.ServiceType.local;
            // Try to determine gitLab service type if it's self-hosted
            const remotelyDetectedService = await this.determineGitLabRemoteServiceType();
            if (remotelyDetectedService)
                return remotelyDetectedService;
            throw errors_1.ErrorFactory.newInternalError(`Unable to detect scanning strategy. It seems that the service is not implemented yet. (Input path: ${path})`);
        };
        this.determineRemoteAccessType = async (remoteService) => {
            if (!remoteService.remoteUrl)
                return undefined;
            if (remoteService.serviceType === IScanningStrategy_1.ServiceType.github) {
                const { owner, repoName } = services_1.GitServiceUtils.parseUrl(remoteService.remoteUrl);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let response;
                try {
                    response = await this.gitHubService.getRepo(owner, repoName);
                }
                catch (error) {
                    this.d(error.message);
                    if (error.status === 401 || error.status === 404 || error.status === 403) {
                        if (error.status === 403 && /API rate limit exceeded/.test(error.message)) {
                            throw errors_1.ErrorFactory.newAuthorizationError(`GitHub ${error.message}`);
                        }
                        this.isOnline = true;
                        return IScanningStrategy_1.AccessType.unknown;
                    }
                    if (error.status === 500) {
                        this.isOnline = false;
                        return IScanningStrategy_1.AccessType.unknown;
                    }
                    throw error;
                }
                if (response.status === 200) {
                    this.isOnline = true;
                    if (response.data.private === true) {
                        return IScanningStrategy_1.AccessType.private;
                    }
                    return IScanningStrategy_1.AccessType.public;
                }
            }
            else if (remoteService.serviceType === IScanningStrategy_1.ServiceType.bitbucket) {
                const { owner, repoName } = services_1.GitServiceUtils.parseUrl(remoteService.remoteUrl);
                try {
                    const response = await this.bitbucketService.getRepo(owner, repoName);
                    this.isOnline = true;
                    if (response.data.is_private === true) {
                        return IScanningStrategy_1.AccessType.private;
                    }
                    return IScanningStrategy_1.AccessType.public;
                }
                catch (error) {
                    this.d(error.message);
                    if (error.code === 401 || error.code === 404 || error.code === 403) {
                        this.isOnline = true;
                        return IScanningStrategy_1.AccessType.unknown;
                    }
                    if (error.status === 500) {
                        this.isOnline = false;
                        return IScanningStrategy_1.AccessType.unknown;
                    }
                    throw error;
                }
            }
            else if (remoteService.serviceType === IScanningStrategy_1.ServiceType.gitlab) {
                const { owner, repoName } = services_1.GitServiceUtils.parseUrl(remoteService.remoteUrl);
                try {
                    const { data } = await this.gitLabService.getRepo(owner, repoName);
                    this.isOnline = true;
                    if (data.visibility === IScanningStrategy_1.AccessType.private) {
                        return IScanningStrategy_1.AccessType.private;
                    }
                    if (data.visibility === IScanningStrategy_1.AccessType.public || (data && !data.visibility)) {
                        return IScanningStrategy_1.AccessType.public;
                    }
                    if (!data) {
                        return IScanningStrategy_1.AccessType.unknown;
                    }
                }
                catch (error) {
                    this.d(error.message);
                    if (!error.response) {
                        this.isOnline = false;
                        return IScanningStrategy_1.AccessType.unknown;
                    }
                    if (error.response.status === 401 ||
                        error.response.status === 404 ||
                        error.response.status === 403 ||
                        error.response.status === 500) {
                        this.isOnline = true;
                        return IScanningStrategy_1.AccessType.unknown;
                    }
                    throw error;
                }
            }
            return undefined;
        };
        this.determineGitLabRemoteServiceType = async () => {
            var _a, _b;
            let serviceType = undefined;
            try {
                await this.gitLabService.listRepos();
                await this.gitLabService.listGroups();
                serviceType = IScanningStrategy_1.ServiceType.gitlab;
            }
            catch (error) {
                return undefined;
            }
            // second check to ensure that it is really a GitLab API
            try {
                const response = await this.gitLabService.checkVersion();
                if (lodash_1.has(response, 'version') && lodash_1.has(response, 'revision')) {
                    return IScanningStrategy_1.ServiceType.gitlab;
                }
            }
            catch (error) {
                this.d(error); //debug error
                if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 || ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 403) {
                    // return undefined if we're not sure that the service is Gitlab
                    //  - it prompts user for a credentials
                    return serviceType;
                }
                return undefined;
            }
        };
        this.gitHubService = gitHubService;
        this.bitbucketService = bitbucketService;
        this.gitLabService = gitLabService;
        this.argumentsProvider = argumentsProvider;
        this.repositoryConfig = repositoryConfig;
        this.d = debug_1.default('scanningStrategyDetector');
    }
    async detect() {
        let accessType;
        let remoteUrl;
        let rootPath;
        let localPath;
        let serviceType;
        const path = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri);
        console.log({ path, uri: this.argumentsProvider.uri });
        try {
            serviceType = await this.determineInputType(this.repositoryConfig.remoteUrl || path);
        }
        catch (e) {
            if (e.code === errors_1.ErrorCode.INTERNAL_ERROR) {
                serviceType = await this.determineInputType(path);
                this.repositoryConfig.remoteUrl = undefined;
            }
        }
        this.d('serviceType', serviceType);
        // try to determine remote origin if input is local file system
        if (serviceType === IScanningStrategy_1.ServiceType.local) {
            remoteUrl = this.repositoryConfig.remoteUrl;
            if (remoteUrl) {
                accessType = await this.determineRemoteAccessType({ remoteUrl: path, serviceType });
            }
        }
        else {
            accessType = await this.determineRemoteAccessType({ remoteUrl: this.repositoryConfig.remoteUrl, serviceType });
        }
        if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath(path)) {
            rootPath = path;
            localPath = path;
            if (await promise_1.default(path).checkIsRepo()) {
                rootPath = await promise_1.default(path).revparse(['--show-toplevel']);
            }
        }
        console.log({ localPath, rootPath });
        return {
            serviceType,
            accessType,
            remoteUrl: this.repositoryConfig.remoteUrl,
            localPath: localPath && path_1.default.resolve(localPath),
            rootPath: rootPath && path_1.default.resolve(rootPath),
            isOnline: this.isOnline,
        };
    }
};
ScanningStrategyDetector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(services_1.GitHubService)),
    __param(1, inversify_1.inject(services_1.BitbucketService)),
    __param(2, inversify_1.inject(GitLabService_1.GitLabService)),
    __param(3, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(4, inversify_1.inject(types_1.Types.RepositoryConfig)),
    __metadata("design:paramtypes", [services_1.GitHubService,
        services_1.BitbucketService,
        GitLabService_1.GitLabService, Object, Object])
], ScanningStrategyDetector);
exports.ScanningStrategyDetector = ScanningStrategyDetector;
//# sourceMappingURL=ScanningStrategyDetector.js.map