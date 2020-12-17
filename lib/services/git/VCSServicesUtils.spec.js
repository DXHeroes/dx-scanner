"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VCSServicesUtils_1 = require("./VCSServicesUtils");
const IBitbucketService_1 = require("../bitbucket/IBitbucketService");
const inspectors_1 = require("../../inspectors");
const IGitHubService_1 = require("./IGitHubService");
const IGitLabService_1 = require("../gitlab/IGitLabService");
describe('VCSServicesUtils', () => {
    describe('getBitbucketStateQueryParam', () => {
        it('returns right query paramater for one state', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketStateQueryParam(IBitbucketService_1.BitbucketIssueState.new);
            expect(response).toEqual(`state="${IBitbucketService_1.BitbucketIssueState.new}"`);
        });
        it('returns right query paramater for one state in array', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketStateQueryParam([IBitbucketService_1.BitbucketIssueState.new]);
            expect(response).toEqual(`state="${IBitbucketService_1.BitbucketIssueState.new}"`);
        });
        it('returns right query paramater for more than one state', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketStateQueryParam([IBitbucketService_1.BitbucketIssueState.new, IBitbucketService_1.BitbucketIssueState.closed]);
            expect(response).toEqual(`state="${IBitbucketService_1.BitbucketIssueState.new}"+OR+state="${IBitbucketService_1.BitbucketIssueState.closed}"`);
        });
        it('returns right query paramater for more than one state', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketStateQueryParam(undefined);
            expect(response).not.toBeDefined();
        });
    });
    describe('getGithubPRState', () => {
        it('returns GitHubPullRequestState.open', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubPRState(inspectors_1.PullRequestState.open);
            expect(response).toEqual(IGitHubService_1.GitHubPullRequestState.open);
        });
        it('returns GitHubPullRequestState.closed', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubPRState(inspectors_1.PullRequestState.closed);
            expect(response).toEqual(IGitHubService_1.GitHubPullRequestState.closed);
        });
        it('returns GitHubPullRequestState.all', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubPRState(inspectors_1.PullRequestState.all);
            expect(response).toEqual(IGitHubService_1.GitHubPullRequestState.all);
        });
        it('returns undefined', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubPRState(undefined);
            expect(response).toEqual(undefined);
        });
    });
    describe('getBitbucketPRState', () => {
        it('returns BitbucketPullRequestState.open', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketPRState(inspectors_1.PullRequestState.open);
            expect(response).toEqual(IBitbucketService_1.BitbucketPullRequestState.open);
        });
        it('returns BitbucketPullRequestState.closed', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketPRState(inspectors_1.PullRequestState.closed);
            expect(response).toEqual(IBitbucketService_1.BitbucketPullRequestState.closed);
        });
        it('returns array of BitbucketPullRequestStates', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketPRState(inspectors_1.PullRequestState.all);
            expect(response).toEqual([IBitbucketService_1.BitbucketPullRequestState.open, IBitbucketService_1.BitbucketPullRequestState.closed, IBitbucketService_1.BitbucketPullRequestState.declined]);
        });
        it('returns undefined', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketPRState(undefined);
            expect(response).toEqual(undefined);
        });
    });
    describe('getGitLabPRState', () => {
        it('returns GitLabPullRequestState.open', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabPRState(inspectors_1.PullRequestState.open);
            expect(response).toEqual(IGitLabService_1.GitLabPullRequestState.open);
        });
        it('returns [GitLabPullRequestState.closed, GitLabPullRequestState.merged]', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabPRState(inspectors_1.PullRequestState.closed);
            expect(response).toEqual([IGitLabService_1.GitLabPullRequestState.closed, IGitLabService_1.GitLabPullRequestState.merged]);
        });
        it('returns GitLabPullRequestState.all', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabPRState(inspectors_1.PullRequestState.all);
            expect(response).toEqual(IGitLabService_1.GitLabPullRequestState.all);
        });
        it('returns undefined', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabPRState(undefined);
            expect(response).toEqual(undefined);
        });
    });
    describe('getGitLabIssueState', () => {
        it('returns GitLabIssueState.open', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabIssueState(inspectors_1.IssueState.open);
            expect(response).toEqual(IGitLabService_1.GitLabIssueState.open);
        });
        it('returns GitLabIssueState.closed', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabIssueState(inspectors_1.IssueState.closed);
            expect(response).toEqual(IGitLabService_1.GitLabIssueState.closed);
        });
        it('returns GitLabIssueState.all', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabIssueState(inspectors_1.IssueState.all);
            expect(response).toEqual(IGitLabService_1.GitLabIssueState.all);
        });
        it('returns undefined', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGitLabIssueState(undefined);
            expect(response).toEqual(undefined);
        });
    });
    describe('getGithubIssueState', () => {
        it('returns GitHubIssueState.open', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubIssueState(inspectors_1.IssueState.open);
            expect(response).toEqual(IGitHubService_1.GitHubIssueState.open);
        });
        it('returns GitHubIssueState.closed', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubIssueState(inspectors_1.IssueState.closed);
            expect(response).toEqual(IGitHubService_1.GitHubIssueState.closed);
        });
        it('returns GitHubIssueState.all', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubIssueState(inspectors_1.IssueState.all);
            expect(response).toEqual(IGitHubService_1.GitHubIssueState.all);
        });
        it('returns undefined', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getGithubIssueState(undefined);
            expect(response).toEqual(undefined);
        });
    });
    describe('getBitbucketIssueState', () => {
        it('returns BitbucketIssueState.new', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketIssueState(inspectors_1.IssueState.open);
            expect(response).toEqual(IBitbucketService_1.BitbucketIssueState.new);
        });
        it('returns BitbucketIssueState.resolved', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketIssueState(inspectors_1.IssueState.closed);
            expect(response).toEqual(IBitbucketService_1.BitbucketIssueState.resolved);
        });
        it('returns [BitbucketIssueState.new, BitbucketIssueState.resolved, BitbucketIssueState.closed]', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketIssueState(inspectors_1.IssueState.all);
            expect(response).toEqual([IBitbucketService_1.BitbucketIssueState.new, IBitbucketService_1.BitbucketIssueState.resolved, IBitbucketService_1.BitbucketIssueState.closed]);
        });
        it('returns undefined', () => {
            const response = VCSServicesUtils_1.VCSServicesUtils.getBitbucketIssueState(undefined);
            expect(response).toEqual(undefined);
        });
    });
    it('returns parsed github link header values if there are prev, next, last and first rel', () => {
        const response = VCSServicesUtils_1.VCSServicesUtils.parseGitHubHeaderLink(`<https://api.github.com/repositories/199797123/issues?per_page=5&page=1>; rel="prev", <https://api.github.com/repositories/199797123/issues?per_page=5&page=3>; rel="next", <https://api.github.com/repositories/199797123/issues?per_page=5&page=3>; rel="last", <https://api.github.com/repositories/199797123/issues?per_page=5&page=1>; rel="first"`);
        expect(response).toMatchObject({
            totalCount: 15,
            page: 2,
            perPage: 5,
            last: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=3',
            next: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=3',
            prev: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=1',
        });
    });
    it('returns parsed github link header values if only next and last rel are provided', () => {
        const response = VCSServicesUtils_1.VCSServicesUtils.parseGitHubHeaderLink('<https://api.github.com/repositories/199797123/issues?per_page=5&page=2>; rel="next", <https://api.github.com/repositories/199797123/issues?per_page=5&page=4>; rel="last"');
        expect(response).toMatchObject({
            totalCount: 20,
            page: 1,
            perPage: 5,
            last: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=4',
            next: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=2',
        });
    });
    it('returns parsed github link header values if only prev and first rel are provided', () => {
        const response = VCSServicesUtils_1.VCSServicesUtils.parseGitHubHeaderLink('<https://api.github.com/repositories/199797123/issues?per_page=10&page=1>; rel="prev", <https://api.github.com/repositories/199797123/issues?per_page=10&page=1>; rel="first"');
        expect(response).toMatchObject({
            totalCount: 10,
            page: 2,
            perPage: 10,
            prev: 'https://api.github.com/repositories/199797123/issues?per_page=10&page=1',
        });
    });
});
//# sourceMappingURL=VCSServicesUtils.spec.js.map