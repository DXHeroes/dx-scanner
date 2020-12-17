"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThinPullRequestsPractice = void 0;
const moment_1 = __importDefault(require("moment"));
const model_1 = require("../../model");
const GitServiceUtils_1 = require("../../services/git/GitServiceUtils");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const ICollaborationInspector_1 = require("../../inspectors/ICollaborationInspector");
const lodash_1 = __importDefault(require("lodash"));
let ThinPullRequestsPractice = class ThinPullRequestsPractice {
    constructor() {
        this.measurePullRequestCount = 1000; // update suggestion text when changed
    }
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        var _a;
        if (!ctx.fileInspector || !ctx.collaborationInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (ctx.config) {
            const config = ctx.config;
            const overridePullRequestCount = (_a = config.override) === null || _a === void 0 ? void 0 : _a.measurePullRequestCount;
            this.measurePullRequestCount = !overridePullRequestCount ? this.measurePullRequestCount : overridePullRequestCount;
        }
        const repoName = GitServiceUtils_1.GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
        const ownerAndRepoName = GitServiceUtils_1.GitServiceUtils.parseUrl(repoName);
        // load all necessary PRs
        const pullRequests = await this.loadPullRequests(ctx, ownerAndRepoName.owner, ownerAndRepoName.repoName);
        const descSortedPullRequests = pullRequests.sort((a, b) => moment_1.default(b.updatedAt || b.createdAt).diff(moment_1.default(a.updatedAt || a.createdAt)));
        if (descSortedPullRequests.length === 0) {
            // not enough data
            return model_1.PracticeEvaluationResult.unknown;
        }
        //get PRs which are no more than 30 days older than the newest PR
        const newestPrDate = moment_1.default(descSortedPullRequests[0].updatedAt || descSortedPullRequests[0].createdAt).subtract(30, 'days');
        const validPullRequests = descSortedPullRequests.filter((d) => {
            return newestPrDate.isBefore(moment_1.default(d.updatedAt || d.createdAt));
        });
        const fatPullRequests = validPullRequests.filter((pullRequest) => { var _a; return ((_a = pullRequest.lines) === null || _a === void 0 ? void 0 : _a.changes) > this.measurePullRequestCount; });
        if (fatPullRequests.length > 0) {
            return model_1.PracticeEvaluationResult.notPracticing;
        }
        return model_1.PracticeEvaluationResult.practicing;
    }
    async loadPullRequests(ctx, owner, repo) {
        let response;
        let items = [];
        let page = 1;
        let hasNextPage = true;
        while (hasNextPage && items.length <= this.measurePullRequestCount) {
            response = await ctx.collaborationInspector.listPullRequests(owner, repo, {
                withDiffStat: true,
                pagination: { page },
                filter: { state: ICollaborationInspector_1.PullRequestState.all },
            });
            items = lodash_1.default.merge(items, response.items); // merge all results
            hasNextPage = response.hasNextPage;
            page++;
        }
        return lodash_1.default.take(items, this.measurePullRequestCount);
    }
};
ThinPullRequestsPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.ThinPullRequestsPractice',
        name: 'Break down large pull requests into smaller ones',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Large pull request are hard to code review and it reduces the probability of finding bugs. Split your PRs into logical units. Do not have PR with more than 1000 changes.',
        reportOnlyOnce: true,
        url: 'https://medium.com/@hugooodias/the-anatomy-of-a-perfect-pull-request-567382bb6067',
        dependsOn: { practicing: ['LanguageIndependent.DoesPullRequests'] },
    })
], ThinPullRequestsPractice);
exports.ThinPullRequestsPractice = ThinPullRequestsPractice;
//# sourceMappingURL=ThinPullRequestsPractice.js.map