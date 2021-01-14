import moment from 'moment';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { ErrorFactory } from '../../lib/errors';
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
  url: 'https://hackernoon.com/45-github-issues-dos-and-donts-dfec9ab4b612',
})
export class TimeToSolveIssuesPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }
    if (!ctx.issueTrackingInspector) {
      throw ErrorFactory.newAuthorizationError('You probably provided bad acess token to your repository or did not provided at all.');
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.parseUrl(repoName);

    //Both GitHub API and Bitbucket API returns open issues by default
    const issues = await ctx.issueTrackingInspector.listIssues(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    const latestIssueUpdate = issues.items.map((item) => moment(item.updatedAt || item.createdAt));

    const dateInPast = moment().subtract(30, 'd');
    const openIssuesTooLong = latestIssueUpdate.filter((d) => d.isSameOrBefore(dateInPast));

    if (openIssuesTooLong.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
