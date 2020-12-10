import lint from '@commitlint/lint';
import lintRules from '@commitlint/config-conventional';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';

@DxPractice({
  id: 'LanguageIndependent.CorrectCommitMessages',
  name: 'Write Commit Messages by Convention',
  impact: PracticeImpact.small,
  suggestion: 'A commit message should be written in a simple understandable language. Use the conventional structure. See the website.',
  reportOnlyOnce: true,
  url: 'https://www.conventionalcommits.org/',
})
export class CorrectCommitMessagesPractice extends PracticeBase implements IPractice {
  private readonly relevantCommitCount = 30;

  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.collaborationInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.parseUrl(repoName);

    const repoCommits = await ctx.collaborationInspector.listRepoCommits(ownerAndRepoName.owner, ownerAndRepoName.repoName, {
      pagination: { perPage: this.relevantCommitCount },
    });
    const messages = repoCommits.items.map((val) => val.message);

    let invalidMessages = await Promise.all(messages.map(async (m) => await lint(m, lintRules.rules)));
    invalidMessages = invalidMessages.filter((m) => !m.valid);

    // save data for detailed report
    this.data.details = [
      {
        type: ReportDetailType.table,
        headers: ['Commit Message', 'Problems'],
        data: invalidMessages.map((im) => {
          return {
            msg: im.input,
            problems: im.warnings
              .map((w) => w.message)
              .concat(im.errors.map((e) => e.message))
              .join('; '),
          };
        }),
      },
    ];

    // return practicing, if more than 80% of commits are correct
    return invalidMessages.length / repoCommits.items.length < 0.8
      ? PracticeEvaluationResult.practicing
      : PracticeEvaluationResult.notPracticing;
  }
}
