import moment from 'moment';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';

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
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined || ctx.collaborationInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.getOwnerAndRepoName(repoName);

    const pullRequests = await ctx.collaborationInspector.getPullRequests(ownerAndRepoName.owner, ownerAndRepoName.repoName, {
      withDiffStat: true,
      maxNumberOfPullRequests: 100,
      filter: { state: PullRequestState.all },
    });

    const descendingSortedPullRequests = pullRequests.items.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
    );
    const daysInMilliseconds = moment.duration(30, 'days').asMilliseconds();
    const newestPrDate = new Date(descendingSortedPullRequests[0].updatedAt || descendingSortedPullRequests[0].createdAt).getTime();

    //get PRs which are no more than 30 days older than the newest PR
    const validPullRequests = descendingSortedPullRequests.filter((val) => {
      const date = new Date(val.updatedAt || val.createdAt).getTime();
      return date > newestPrDate - daysInMilliseconds;
    });

    const fatPullRequests = validPullRequests.filter((pullRequest) => <number>pullRequest.lines?.changes > 500);
    if (fatPullRequests.length > 0) {
      return PracticeEvaluationResult.notPracticing;
    }

    return PracticeEvaluationResult.practicing;
  }
}
