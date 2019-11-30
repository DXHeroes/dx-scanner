/* eslint-disable @typescript-eslint/no-unused-vars */

import { IPractice } from './IPractice';
import { ErrorFactory } from '../lib/errors';
import { PracticeEvaluationResult } from '../model';
import { PracticeContext } from '../contexts/practice/PracticeContext';

export abstract class PracticeBase<T extends PracticeBaseData> implements IPractice {
  data: T;

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

type PracticeBaseData = {
  detail?: string;
};
