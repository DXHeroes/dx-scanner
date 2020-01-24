import _ from 'lodash';
import { PracticeImpact } from '../../model';
import { ArgumentsProvider } from '../../scanner';

export const argumentsProviderFactory = (params: Partial<ArgumentsProvider> = {}): ArgumentsProvider => {
  return _.merge(
    { uri: './', auth: undefined, json: false, fail: PracticeImpact.high, recursive: true, ci: false, fix: false, fixPattern: undefined },
    params,
  );
};
