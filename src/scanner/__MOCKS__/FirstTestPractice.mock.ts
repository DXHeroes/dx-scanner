import { DxPractice } from '../../practices/DxPracticeDecorator';
import { PracticeImpact, PracticeEvaluationResult } from '../../model';
import { IPractice } from '../../practices/IPractice';

@DxPractice({
  id: 'Mock.FirstTestPractice',
  name: 'FirstTestPractice',
  impact: PracticeImpact.medium,
  suggestion: '...',
  reportOnlyOnce: true,
  url: '...',
  dependsOn: { practicing: ['Mock.SecondTestPractice'] },
})
export class FirstTestPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async evaluate(): Promise<PracticeEvaluationResult> {
    return Promise.resolve(PracticeEvaluationResult.practicing);
  }
}
