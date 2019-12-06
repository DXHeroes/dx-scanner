import moment from 'moment';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { PullRequestState } from '../../inspectors/ICollaborationInspector';

@DxPractice({
  id: 'LanguageIndependent.TimeToSolve',
  name: '',
  impact: PracticeImpact.medium,
  suggestion: '',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/pull-requests',
  dependsOn: { practicing: ['LanguageIndependent.DoesPullRequests'] },
})
export class TimeToSolvePractice implements IPractice {
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
      filter: { state: PullRequestState.open },
    });

    if (pullRequests.items.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    const latestPRsUpdate = pullRequests.items.map((item) => new Date(item.updatedAt || item.createdAt).getTime());

    const descendingSortedPrDates = latestPRsUpdate.sort((prA, prB) => prB - prA);

    const daysInMilliseconds = moment.duration(30, 'days').asMilliseconds();
    const now = Date.now();
    const openPullrequestsTooLong = [];

    descendingSortedPrDates.forEach((prDate) => {
      if (now - prDate > daysInMilliseconds) {
        openPullrequestsTooLong.push(prDate);
      }
    });

    if (openPullrequestsTooLong.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
