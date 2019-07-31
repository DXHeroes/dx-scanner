import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';

@DxPractice({
  id: 'general.unitTestPractice',
  name: 'Unit tests',
  impact: PracticeImpact.high,
  suggestion: 'Start writing unit tests to improve code quality.',
  reportOnlyOnce: true,
  url: 'https://www.google.com/?q=pull-requests',
})
export class UnitTestPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }
  async evaluate(): Promise<PracticeEvaluationResult> {
    return PracticeEvaluationResult.unknown;
  }
}
