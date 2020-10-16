import { duration } from 'moment';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { PracticeBase } from '../PracticeBase';
import { PullRequestDto } from '../../reporters';

@DxPractice({
  id: 'LanguageIndependent.DoesPullRequests',
  name: 'Do PullRequests',
  impact: PracticeImpact.medium,
  suggestion: 'Do pull requests. It helps you catch the bad code before it is merged into the main codebase.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/pull-requests',
})
export class DoesPullRequestsPractice extends PracticeBase {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined || ctx.collaborationInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.parseUrl(repoName);

    const pullRequests = await ctx.collaborationInspector.listPullRequests(ownerAndRepoName.owner, ownerAndRepoName.repoName, {
      filter: { state: PullRequestState.all },
    });
    const repoCommits = await ctx.collaborationInspector.listRepoCommits(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    this.setData(
      pullRequests.items.map((pr) => {
        return {
          id: pr.id,
          url: pr.url,
          name: pr.title,
          createdAt: pr.createdAt,
          updatedAt: pr.updatedAt,
          //if mergedAt is null and closedAt is not null pr was closed, if both are not null pr is opened, if mergedAt is not null and closedAt is null pr was merged
          closedAt: pr.mergedAt ? null : pr.closedAt,
          mergedAt: pr.mergedAt,
          authorName: pr.user.login,
          authorUrl: pr.user.url!,
        };
      }),
    );

    if (pullRequests.items.length === 0) {
      return PracticeEvaluationResult.notPracticing;
    }

    const latestPRsUpdate = pullRequests.items.map((item) => new Date(item.updatedAt || item.createdAt).getTime());

    const descendingSortedPrDates = latestPRsUpdate.sort((prA, prB) => prB - prA);
    const descendingSortedCommitDate = repoCommits.items.sort(
      (commitA, commitB) => new Date(commitB.author.date).getTime() - new Date(commitA.author.date).getTime(),
    );

    const prDate = descendingSortedPrDates[0];
    const commitDate = new Date(descendingSortedCommitDate[0].author.date).getTime();
    const daysInMilliseconds = duration(30, 'days').asMilliseconds();

    if (prDate > commitDate - daysInMilliseconds) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }

  setData(pullRequests: PullRequestDto[]): void {
    this.data.statistics = { pullRequests: pullRequests };
  }
}
