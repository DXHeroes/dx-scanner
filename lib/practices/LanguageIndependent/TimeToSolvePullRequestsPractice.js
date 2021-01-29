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
exports.TimeToSolvePullRequestsPractice = void 0;
const moment_1 = __importDefault(require("moment"));
const model_1 = require("../../model");
const GitServiceUtils_1 = require("../../services/git/GitServiceUtils");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let TimeToSolvePullRequestsPractice = class TimeToSolvePullRequestsPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.collaborationInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const repoName = GitServiceUtils_1.GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
        const ownerAndRepoName = GitServiceUtils_1.GitServiceUtils.parseUrl(repoName);
        //Both GitHub API and Bitbucket API returns open pullrequests by default
        const pullRequests = await ctx.collaborationInspector.listPullRequests(ownerAndRepoName.owner, ownerAndRepoName.repoName);
        const latestPRsUpdate = pullRequests.items.map((item) => moment_1.default(item.updatedAt || item.createdAt));
        const dateInPast = moment_1.default().subtract(30, 'd');
        const openPullRequestsTooLong = latestPRsUpdate.filter((d) => d.isSameOrBefore(dateInPast));
        if (openPullRequestsTooLong.length === 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
TimeToSolvePullRequestsPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.TimeToSolvePullRequests',
        name: 'Solve Pull Requests Continuously',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Do not have an open Pull Request more than 30 days. Review PRs continuously.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/pull-requests',
        dependsOn: { practicing: ['LanguageIndependent.DoesPullRequests'] },
    })
], TimeToSolvePullRequestsPractice);
exports.TimeToSolvePullRequestsPractice = TimeToSolvePullRequestsPractice;
//# sourceMappingURL=TimeToSolvePullRequestsPractice.js.map