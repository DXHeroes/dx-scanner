import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { sharedSubpath } from '../../detectors/utils';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { ReporterUtils } from '../../reporters/ReporterUtils';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import moment from 'moment';

@DxPractice({
  id: 'LanguageIndependent.DoesPullRequests',
  name: 'Do PullRequests',
  impact: PracticeImpact.medium,
  suggestion: 'Do pull requests. It helps you catch the bad code before it is merged into the main codebase.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/pull-requests',
})
export class DoesPullRequestsPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined || ctx.collaborationInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.getOwnerAndRepoName(repoName);

    const pullRequests = await ctx.collaborationInspector.getPullRequests(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    const repoCommits = await ctx.collaborationInspector.getRepoCommits(ownerAndRepoName.owner, ownerAndRepoName.repoName);

    let prDate;

    if (pullRequests.items.length > 0) {
      prDate = new Date(pullRequests.items[0].createdAt).getTime();
    } else {
      return PracticeEvaluationResult.notPracticing;
    }

    const commitDate = new Date(repoCommits.items[0].author.date).getTime();

    const daysInMilliseconds = moment.duration(30, 'days').asMilliseconds();

    if (prDate > commitDate - daysInMilliseconds) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
