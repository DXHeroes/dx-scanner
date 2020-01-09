import moment from 'moment';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'LanguageIndependent.TimeToSolvePullRequests',
  name: 'Solve Pull Requests Continuously',
  impact: PracticeImpact.medium,
  suggestion: 'Do not have an open Pull Request more than 30 days. Review PRs continuously.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/pull-requests',
  dependsOn: { practicing: ['LanguageIndependent.DoesPullRequests'] },
})
export class TimeToSolvePullRequestsPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.collaborationInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.getOwnerAndRepoName(repoName);

    //Both GitHub API and Bitbucket API returns open pullrequests by default
    const pullRequests = await ctx.collaborationInspector.getPullRequests(ownerAndRepoName.owner, ownerAndRepoName.repoName);

    const latestPRsUpdate = pullRequests.items.map((item) => moment(item.updatedAt || item.createdAt));

    const dateInPast = moment().subtract(30, 'd');
    const openPullRequestsTooLong = latestPRsUpdate.filter((d) => d.isSameOrBefore(dateInPast));

    if (openPullRequestsTooLong.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
