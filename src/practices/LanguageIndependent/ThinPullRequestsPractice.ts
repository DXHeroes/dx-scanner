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
    'Large pull request are hard to code review and it reduces the probability of finding bugs. Split your PRs into logical units. Do not have PR with more than 1000 changes.',
  reportOnlyOnce: true,
  url: 'https://medium.com/@hugooodias/the-anatomy-of-a-perfect-pull-request-567382bb6067',
  dependsOn: { practicing: ['LanguageIndependent.DoesPullRequests'] },
})
export class ThinPullRequestsPractice implements IPractice {
  private readonly measurePullRequestCount = 1000; // update suggestion text when changed

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

    const descSortedPullRequests = pullRequests.sort((a, b) => moment(b.updatedAt || b.createdAt).diff(moment(a.updatedAt || a.createdAt)));

    if (descSortedPullRequests.length === 0) {
      // not enough data
      return PracticeEvaluationResult.unknown;
    }

    //get PRs which are no more than 30 days older than the newest PR
    const newestPrDate = moment(descSortedPullRequests[0].updatedAt || descSortedPullRequests[0].createdAt).subtract(30, 'days');
    const validPullRequests = descSortedPullRequests.filter((d) => {
      return newestPrDate.isBefore(moment(d.updatedAt || d.createdAt));
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
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && items.length <= this.measurePullRequestCount) {
      response = await ctx.collaborationInspector!.listPullRequests(owner, repo, {
        withDiffStat: true,
        pagination: { page },
        filter: { state: PullRequestState.all },
      });

      items = _.merge(items, response.items); // merge all results
      hasNextPage = response.hasNextPage;
      page++;
    }

    return _.take(items, this.measurePullRequestCount);
  }
}
