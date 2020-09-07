import { ESLint } from 'eslint';
import _ from 'lodash';

export const getEsLintReport = (params?: Partial<ESLint.LintResult[]>): ESLint.LintResult[] => {
  return _.merge(
    [
      {
        filePath: '/Users/adelka/lodash/.internal/cloneDataView.js',
        messages: [],
        errorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ],
    params,
  );
};
