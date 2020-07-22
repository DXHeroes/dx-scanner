import { CLIEngine } from 'eslint';
import _ from 'lodash';

export const getEsLintReport = (params?: Partial<CLIEngine.LintReport>): CLIEngine.LintReport => {
  return _.merge(
    {
      errorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      results: [
        {
          filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
          messages: [],
          errorCount: 0,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
          usedDeprecatedRules: [],
        },
      ],
    },
    params,
  );
};
