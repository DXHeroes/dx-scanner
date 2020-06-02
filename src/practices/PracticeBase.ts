import { IPractice, PracticeData } from './IPractice';
import { ErrorFactory } from '../lib/errors';
import { PracticeEvaluationResult } from '../model';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import { injectable } from 'inversify';

@injectable()
export abstract class PracticeBase<T = Record<string, unknown>> implements IPractice<T> {
  data: Partial<T> & PracticeData;

  constructor() {
    this.data = {};
  }

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    throw ErrorFactory.newInternalError('Method not implemented.');
  }
}
