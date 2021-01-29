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
exports.CIReporter = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const services_1 = require("../services");
const CIReporterUtils_1 = require("./CIReporterUtils");
const assertNever_1 = require("../lib/assertNever");
const debug_1 = require("debug");
const CIReportBuilder_1 = require("./builders/CIReportBuilder");
const ScanningStrategyDetectorUtils_1 = require("../detectors/utils/ScanningStrategyDetectorUtils");
const lodash_1 = __importDefault(require("lodash"));
const GitLabService_1 = require("../services/gitlab/GitLabService");
const gitlabUtils_1 = require("../services/gitlab/gitlabClient/gitlabUtils");
let CIReporter = class CIReporter {
    constructor(argumentsProvider, repositoryConfig, scanningStrategy, gitHubService, bitbucketService, gitLabService) {
        this.d = debug_1.debug('CIReporter');
        this.argumentsProvider = argumentsProvider;
        this.repositoryConfig = repositoryConfig;
        this.scanningStrategy = scanningStrategy;
        this.gitHubService = gitHubService;
        this.bitbucketService = bitbucketService;
        this.gitLabService = gitLabService;
    }
    async report(practicesAndComponents) {
        this.config = await this.detectConfiguration();
        this.d(this.config);
        if (!this.config) {
            const msg = 'Your CI provider is not supported yet. Please add a feature request on https://github.com/DXHeroes/dx-scanner/issues';
            this.d(msg);
            return;
        }
        else if (!this.config.pullRequestId) {
            const msg = "This isn't a pull request.";
            this.d(msg);
            return;
        }
        else if (!ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath(this.argumentsProvider.uri)) {
            const msg = 'CIReporter works only for local path';
            this.d(msg);
            return;
        }
        const reportString = this.buildReport(practicesAndComponents);
        this.d(reportString);
        return this.postMessage(reportString).catch((error) => {
            this.d(error.message);
            if (error.code === 401 || error.code === 404 || error.code === 403) {
                return undefined;
            }
            throw error;
        });
    }
    buildReport(practicesAndComponents) {
        const builder = new CIReportBuilder_1.CIReportBuilder(practicesAndComponents, this.scanningStrategy);
        return builder.build();
    }
    async postMessage(message) {
        let client;
        switch (this.config.service) {
            case services_1.VCSServiceType.github:
                client = this.gitHubService;
                break;
            case services_1.VCSServiceType.bitbucket:
                client = this.bitbucketService;
                break;
            case services_1.VCSServiceType.gitlab:
                client = this.gitLabService;
                break;
            default:
                return assertNever_1.assertNever(this.config.service);
        }
        // try to find last report comment
        let prComments = [];
        let hasNextPage = true;
        let page = 1;
        while (hasNextPage) {
            const res = await client.listPullRequestComments(this.config.repository.owner, this.config.repository.name, this.config.pullRequestId, { pagination: { page, perPage: 50 } });
            prComments = lodash_1.default.concat(prComments, res.items);
            hasNextPage = res.hasNextPage;
            page++;
        }
        this.d(prComments);
        const ciReporterComments = prComments.filter((c) => { var _a; return (_a = c.body) === null || _a === void 0 ? void 0 : _a.includes(CIReportBuilder_1.CIReportBuilder.ciReportIndicator); });
        let comment;
        if (ciReporterComments.length > 0) {
            // update comment if already exists
            comment = await client.updatePullRequestComment(this.config.repository.owner, this.config.repository.name, ciReporterComments[ciReporterComments.length - 1].id, message, this.config.pullRequestId);
        }
        else {
            // post a comment
            comment = await client.createPullRequestComment(this.config.repository.owner, this.config.repository.name, this.config.pullRequestId, message);
        }
        this.d(comment);
        return comment;
    }
    async detectConfiguration() {
        // eslint-disable-next-line no-process-env
        const ev = process.env;
        if (ev.TRAVIS && ev.TRAVIS_REPO_SLUG) {
            // detect Travis config
            this.d('Is Travis');
            return CIReporterUtils_1.CIReporterUtils.loadConfigurationTravis();
        }
        else if (ev.APPVEYOR === 'True' || ev.APPVEYOR === 'true') {
            // detect Appveyor config
            this.d('Is Appveyor');
            return CIReporterUtils_1.CIReporterUtils.loadConfigurationAppveyor();
        }
        else if (ev.GITHUB_ACTIONS === 'true') {
            // detect GitHub Actions config
            this.d('Is Github');
            return CIReporterUtils_1.CIReporterUtils.loadConfigurationGitHubActions();
        }
        else if (ev.BITBUCKET_BUILD_NUMBER) {
            // detect Bitbucket config
            this.d('Is Bitbucket');
            return CIReporterUtils_1.CIReporterUtils.loadConfigurationBitbucket();
        }
        else if (ev.GITLAB_CI === 'true') {
            // detect GitLab config
            this.d('Is GitLab');
            const client = new gitlabUtils_1.GitLabClient({
                token: this.argumentsProvider.auth,
                host: this.repositoryConfig.baseUrl,
            });
            const prs = await client.MergeRequests.list(ev.CI_PROJECT_ID, { filter: { sourceBranch: ev.CI_COMMIT_BRANCH } });
            const prForThisPipeline = prs.data.find((p) => p.sha === ev.CI_COMMIT_SHA);
            if (!prForThisPipeline) {
                this.d('Can not find relevant Merge Request', ev.CI_PROJECT_ID, ev.CI_COMMIT_BRANCH, ev.CI_COMMIT_SHA);
                return undefined;
            }
            return {
                service: services_1.VCSServiceType.gitlab,
                pullRequestId: prForThisPipeline.iid,
                repository: {
                    owner: ev.CI_PROJECT_NAMESPACE,
                    name: ev.CI_PROJECT_NAME,
                },
            };
        }
        else {
            // not supported yet
            this.d('Is undefined CI');
            return undefined;
        }
    }
};
CIReporter = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(types_1.Types.RepositoryConfig)),
    __param(2, inversify_1.inject(types_1.Types.ScanningStrategy)),
    __param(3, inversify_1.inject(services_1.GitHubService)),
    __param(4, inversify_1.inject(services_1.BitbucketService)),
    __param(5, inversify_1.inject(GitLabService_1.GitLabService)),
    __metadata("design:paramtypes", [Object, Object, Object, services_1.GitHubService,
        services_1.BitbucketService,
        GitLabService_1.GitLabService])
], CIReporter);
exports.CIReporter = CIReporter;
//# sourceMappingURL=CIReporter.js.map