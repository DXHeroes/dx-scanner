import moment from 'moment';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import _ from 'lodash';
import { PullRequest } from '../../services/git/model';
import { Paginated } from '../../inspectors';

@DxPractice({
  id: 'LanguageIndependent.ThinPullRequestsPractice',
  name: 'Break down large pull requests into smaller ones',
  impact: PracticeImpact.medium,
  suggestion:
    'Large pull request are hard to code review and it reduces the probability of finding bugs. Split your PRs into logical units. Do not have PR with more than 500 changes.',
  reportOnlyOnce: true,
  url: 'https://medium.com/@hugooodias/the-anatomy-of-a-perfect-pull-request-567382bb6067',
})
export class ThinPullRequestsPractice implements IPractice {
  private readonly measurePullRequestCount = 500; // update suggestion text when changed

  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.collaborationInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.getOwnerAndRepoName(repoName);

    // load all necessary PRs
    const pullRequests = await this.loadPullRequests(ctx, ownerAndRepoName.owner, ownerAndRepoName.repoName);

    const descSortedPullRequests = pullRequests.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
    );

    if (descSortedPullRequests.length === 0) {
      // not enough data
      return PracticeEvaluationResult.unknown;
    }

    const daysInMilliseconds = moment.duration(30, 'days').asMilliseconds();
    const newestPrDate = new Date(descSortedPullRequests[0].updatedAt || descSortedPullRequests[0].createdAt).getTime();

    //get PRs which are no more than 30 days older than the newest PR
    const validPullRequests = descSortedPullRequests.filter((val) => {
      const date = new Date(val.updatedAt || val.createdAt).getTime();
      return date > newestPrDate - daysInMilliseconds;
    });

    const fatPullRequests = validPullRequests.filter((pullRequest) => <number>pullRequest.lines?.changes > this.measurePullRequestCount);
    if (fatPullRequests.length > 0) {
      return PracticeEvaluationResult.notPracticing;
    }

    return PracticeEvaluationResult.practicing;
  }

  private async loadPullRequests(ctx: PracticeContext, owner: string, repo: string) {
    let response: Paginated<PullRequest>;
    let items: PullRequest[] = [];

    for (let page = 1, hasNextPage; items.length < this.measurePullRequestCount && hasNextPage; page++) {
      response = await ctx.collaborationInspector!.getPullRequests(owner, repo, {
        withDiffStat: true,
        pagination: { page },
        filter: { state: PullRequestState.all },
      });

      items = _.merge(items, response.items); // merge all results
      hasNextPage = response.hasNextPage;
    }

    return _.take(items, this.measurePullRequestCount);
  }
}
