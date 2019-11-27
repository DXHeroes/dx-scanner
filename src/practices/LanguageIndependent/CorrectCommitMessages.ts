import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { GitServiceUtils } from '../../services/git/GitServiceUtils';
import { intersection } from 'lodash';

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

    const conventionalElements = [
      'build',
      'ci',
      'chore',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      'test',
      'Update',
      'Merge',
    ];
    const elements: string[] = [];
    //const messages = ['fix(core): test', 'chore: test2', 'Merge pr'];

    messages.forEach((message) => {
      let element;
      element = message.split(':');

      if (element.length > 1) {
        element = element[0].split('(');
        elements.push(element[0]);
      } else {
        const element = message.split(' ');
        elements.push(element[0]);
      }
    });

    if (elements.length < 1) {
      return PracticeEvaluationResult.notPracticing;
    }

    const isCorrectCommit = elements.every((element) => conventionalElements.includes(element));

    return isCorrectCommit ? PracticeEvaluationResult.practicing : PracticeEvaluationResult.notPracticing;
  }
}
