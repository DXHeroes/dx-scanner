import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';

@DxPractice({
  id: 'general.pullRequests',
  name: 'Pull requests',
  impact: PracticeImpact.high,
  suggestion: 'Start making pull requests',
  reportOnlyOnce: true,
  url: 'https://www.google.com/?q=pull-requests',
})
export class PullRequestPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(): Promise<PracticeEvaluationResult> {
    // if (component.git && component.git.pullRequests === false && component.git.activeContributorsCount > 1) {
    //   return PracticeCheckResult.notPracticing;
    // } else if (component.git && component.git.pullRequests === true) {
    //   return PracticeCheckResult.practicing;
    // }
    return PracticeEvaluationResult.unknown;
  }
}
