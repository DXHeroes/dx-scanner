import moment from 'moment';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'LanguageIndependent.TimeToSolveIssues',
  name: 'Solve Issues Continuously',
  impact: PracticeImpact.medium,
  suggestion: 'Do not have an open Issues more than 60 days. Solve Issues continuously.',
  reportOnlyOnce: true,
  url: 'https://guides.github.com/features/issues/\nhttps://confluence.atlassian.com/bitbucket/issue-trackers-221449750.html',
})
export class TimeToSolveIssuesPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined || ctx.issueTrackingInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.getOwnerAndRepoName(repoName);

    //Both GitHub API and Bitbucket API returns open issues by default
    const issues = await ctx.issueTrackingInspector.getIssues(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    const latestIssueUpdate = issues.items.map((item) => new Date(item.updatedAt || item.createdAt).getTime());

    const daysInMilliseconds = moment.duration(60, 'days').asMilliseconds();
    const now = Date.now();
    const openPullRequestsTooLong = [];

    latestIssueUpdate.forEach((issueDate) => {
      if (now - issueDate > daysInMilliseconds) {
        openPullRequestsTooLong.push(issueDate);
      }
    });

    if (openPullRequestsTooLong.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
