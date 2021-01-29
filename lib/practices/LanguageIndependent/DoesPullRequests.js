"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoesPullRequestsPractice = void 0;
const moment_1 = require("moment");
const model_1 = require("../../model");
const GitServiceUtils_1 = require("../../services/git/GitServiceUtils");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const ICollaborationInspector_1 = require("../../inspectors/ICollaborationInspector");
const PracticeBase_1 = require("../PracticeBase");
let DoesPullRequestsPractice = class DoesPullRequestsPractice extends PracticeBase_1.PracticeBase {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (ctx.fileInspector === undefined || ctx.collaborationInspector === undefined) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const repoName = GitServiceUtils_1.GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
        const ownerAndRepoName = GitServiceUtils_1.GitServiceUtils.parseUrl(repoName);
        const pullRequests = await ctx.collaborationInspector.listPullRequests(ownerAndRepoName.owner, ownerAndRepoName.repoName, {
            filter: { state: ICollaborationInspector_1.PullRequestState.all },
        });
        const repoCommits = await ctx.collaborationInspector.listRepoCommits(ownerAndRepoName.owner, ownerAndRepoName.repoName);
        this.setData(pullRequests.items.map((pr) => {
            return {
                id: pr.id,
                url: pr.url,
                name: pr.title,
                createdAt: pr.createdAt,
                updatedAt: pr.updatedAt,
                //if mergedAt is null and closedAt is not null pr was closed, if both are not null pr is opened, if mergedAt is not null and closedAt is null pr was merged
                closedAt: pr.mergedAt ? null : pr.closedAt,
                mergedAt: pr.mergedAt,
                authorName: pr.user.login || null,
                authorUrl: pr.user.url || null,
            };
        }));
        if (pullRequests.items.length === 0) {
            return model_1.PracticeEvaluationResult.notPracticing;
        }
        const latestPRsUpdate = pullRequests.items.map((item) => new Date(item.updatedAt || item.createdAt).getTime());
        const descendingSortedPrDates = latestPRsUpdate.sort((prA, prB) => prB - prA);
        const descendingSortedCommitDate = repoCommits.items.sort((commitA, commitB) => new Date(commitB.author.date).getTime() - new Date(commitA.author.date).getTime());
        const prDate = descendingSortedPrDates[0];
        const commitDate = new Date(descendingSortedCommitDate[0].author.date).getTime();
        const daysInMilliseconds = moment_1.duration(30, 'days').asMilliseconds();
        if (prDate > commitDate - daysInMilliseconds) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    setData(pullRequests) {
        this.data.statistics = { pullRequests: pullRequests };
    }
};
DoesPullRequestsPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.DoesPullRequests',
        name: 'Do PullRequests',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Do pull requests. It helps you catch the bad code before it is merged into the main codebase.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/pull-requests',
    })
], DoesPullRequestsPractice);
exports.DoesPullRequestsPractice = DoesPullRequestsPractice;
//# sourceMappingURL=DoesPullRequests.js.map