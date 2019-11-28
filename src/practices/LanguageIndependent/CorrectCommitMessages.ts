import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import * as parser from 'parse-commit-message';

@DxPractice({
  id: 'LanguageIndependent.CorrectCommitMessages',
  name: 'Write Commit Messages by Convention',
  impact: PracticeImpact.small,
  suggestion: '',
  reportOnlyOnce: true,
  url: 'https://www.conventionalcommits.org/en/v1.0.0/',
})
export class CorrectCommitMessagesPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.collaborationInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const repoName = GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
    const ownerAndRepoName = GitServiceUtils.getOwnerAndRepoName(repoName);

    const repoCommits = await ctx.collaborationInspector.getRepoCommits(ownerAndRepoName.owner, ownerAndRepoName.repoName);
    const messages = repoCommits.items.map((val) => val.message);

    const areCorrectMessages = parser.validate(messages, false);

    return areCorrectMessages ? PracticeEvaluationResult.practicing : PracticeEvaluationResult.notPracticing;
  }
}
