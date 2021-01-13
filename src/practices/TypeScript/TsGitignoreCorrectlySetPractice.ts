import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { ReportDetailType } from '../../reporters/ReporterData';
import * as path from 'path';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';

@DxPractice({
  id: 'TypeScript.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class TsGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
  private tsconfig: any;
  private tsconfigOutdir: string | undefined;
  private tsconfigOutfile: string | undefined;

  constructor() {
    super();
    this.applicableLanguages = [ProgrammingLanguage.TypeScript];
    this.ruleChecks = [
      // node_modules
      { regex: /node_modules/, fix: 'node_modules/' },
      // misc
      { regex: /coverage/, fix: '/coverage' },
      { regex: /\.log/, fix: '*.log' },
      // tsconfig check
      {
        check: (ctx, v) => {
          if (this.tsconfigOutdir === undefined) {
            return undefined;
          }

          if (new RegExp(this.tsconfigOutdir).test(v)) {
            return undefined;
          }

          return `/${this.tsconfigOutdir}`;
        },
      },
      {
        check: (ctx, v) => {
          if (this.tsconfigOutfile === undefined) {
            return undefined;
          }

          if (new RegExp(this.tsconfigOutfile).test(v)) {
            return undefined;
          }

          return `${this.tsconfigOutfile}`;
        },
      },
    ];
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const fileInspector = await GitignoreCorrectlySetPracticeBase.checkFileInspector(ctx);
    if (!fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    /**
     * We need to require tsconfig here due to issues with tsconfig in DXSE
     */
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    this.tsconfig = require('tsconfig');
    const tsConfig = await this.tsconfig.load(fileInspector.basePath || '.');
    this.tsconfigOutdir = undefined;
    this.tsconfigOutfile = undefined;
    if (tsConfig) {
      if (tsConfig.config.compilerOptions.outDir) {
        this.tsconfigOutdir = path.basename(tsConfig.config.compilerOptions.outDir);
      } else if (tsConfig.config.compilerOptions.outFile) {
        this.tsconfigOutfile = path.basename(tsConfig.config.compilerOptions.outFile);
      }
    }

    return super.evaluate(ctx);
  }

  protected setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text:
          'You should ignore one of the build folders (build, dist or lib), one of the lock files (package-lock.json or yarn.lock), node_modules folder, coverage folder and log files (*.log)',
      },
    ];
  }
}
