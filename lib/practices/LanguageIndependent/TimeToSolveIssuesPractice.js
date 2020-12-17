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
exports.TimeToSolveIssuesPractice = void 0;
const moment_1 = __importDefault(require("moment"));
const model_1 = require("../../model");
const GitServiceUtils_1 = require("../../services/git/GitServiceUtils");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let TimeToSolveIssuesPractice = class TimeToSolveIssuesPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (ctx.fileInspector === undefined || ctx.issueTrackingInspector === undefined) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const repoName = GitServiceUtils_1.GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
        const ownerAndRepoName = GitServiceUtils_1.GitServiceUtils.parseUrl(repoName);
        //Both GitHub API and Bitbucket API returns open issues by default
        const issues = await ctx.issueTrackingInspector.listIssues(ownerAndRepoName.owner, ownerAndRepoName.repoName);
        const latestIssueUpdate = issues.items.map((item) => moment_1.default(item.updatedAt || item.createdAt));
        const dateInPast = moment_1.default().subtract(30, 'd');
        const openIssuesTooLong = latestIssueUpdate.filter((d) => d.isSameOrBefore(dateInPast));
        if (openIssuesTooLong.length === 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
TimeToSolveIssuesPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.TimeToSolveIssues',
        name: 'Solve Issues Continuously',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Do not have an open Issues more than 60 days. Solve Issues continuously.',
        reportOnlyOnce: true,
        url: 'https://hackernoon.com/45-github-issues-dos-and-donts-dfec9ab4b612',
    })
], TimeToSolveIssuesPractice);
exports.TimeToSolveIssuesPractice = TimeToSolveIssuesPractice;
//# sourceMappingURL=TimeToSolveIssuesPractice.js.map