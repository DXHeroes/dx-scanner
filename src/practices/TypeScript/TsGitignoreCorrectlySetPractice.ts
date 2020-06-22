/* eslint-disable @typescript-eslint/no-var-requires */
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { FixerContext } from '../../contexts/fixer/FixerContext';
import * as path from 'path';

@DxPractice({
  id: 'TypeScript.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class TsGitignoreCorrectlySetPractice extends PracticeBase {
  private parsedGitignore: string[] = [];

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.TypeScript;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const parseGitignore = (gitignoreFile: string) => {
      return gitignoreFile
        .toString()
        .split(/\r?\n/)
        .filter((content) => content.trim() !== '' && !content.startsWith('#'));
    };
    const content = await ctx.root.fileInspector.readFile('.gitignore');
    const parsedGitignore = parseGitignore(content);
    this.parsedGitignore = parsedGitignore;

    // folders with compiled code
    const buildRegex = parsedGitignore.find((value: string) => /build/.test(value));
    const libRegex = parsedGitignore.find((value: string) => /lib/.test(value));
    const distRegex = parsedGitignore.find((value: string) => /dist/.test(value));
    // lockfiles
    const packageJsonRegex = parsedGitignore.find((value: string) => /package-lock\.json/.test(value));
    const yarnLockRegex = parsedGitignore.find((value: string) => /yarn\.lock/.test(value));
    // node_modules
    const nodeModulesRegex = parsedGitignore.find((value: string) => /node_modules/.test(value));
    // misc
    const coverageRegex = parsedGitignore.find((value: string) => /coverage/.test(value));
    const errorLogRegex = parsedGitignore.find((value: string) => /\.log/.test(value));

    const exactlyOneLockfile = (packageJsonRegex && !yarnLockRegex) || (!packageJsonRegex && yarnLockRegex);

    if ((buildRegex || libRegex || distRegex) && exactlyOneLockfile && nodeModulesRegex && errorLogRegex && coverageRegex) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    /**
     * We need to require tsconfig here due to issues with tsconfig in DXSE
     */
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const tsconfig = require('tsconfig');
    const inspector = ctx.fileInspector?.basePath ? ctx.fileInspector : ctx.root.fileInspector;
    if (!inspector) return;
    // node_modules
    const nodeModulesRegex = this.parsedGitignore.find((value: string) => /node_modules/.test(value));
    // misc
    const coverageRegex = this.parsedGitignore.find((value: string) => /coverage/.test(value));
    const errorLogRegex = this.parsedGitignore.find((value: string) => /\.log/.test(value));
    const fixes = [
      nodeModulesRegex ? undefined : '/node_modules',
      coverageRegex ? undefined : '/coverage',
      errorLogRegex ? undefined : '*.log',
    ]
      .filter(Boolean)
      .concat(''); // append newline if we add something

    const tsConfig = await tsconfig.load(inspector.basePath || '.');
    if (tsConfig) {
      if (tsConfig.config.compilerOptions.outDir) {
        const folderName = path.basename(tsConfig.config.compilerOptions.outDir);
        if (!this.parsedGitignore.find((value: string) => new RegExp(folderName).test(value))) {
          fixes.unshift(`/${folderName}`);
        }
      } else if (tsConfig.config.compilerOptions.outFile) {
        const fileName = path.basename(tsConfig.config.compilerOptions.outFile);
        if (!this.parsedGitignore.find((value: string) => new RegExp(fileName).test(value))) {
          fixes.unshift(`${fileName}`);
        }
      }
    }

    if (fixes.length > 1) fixes.unshift(''); // if there is something to add, make sure we start with newline
    await inspector.appendFile('.gitignore', fixes.join('\n'));
  }

  private setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text:
          'You should ignore one of the build folders (build, dist or lib), one of the lock files (package-lock.json or yarn.lock), node_modules folder, coverage folder and log files (*.log)',
      },
    ];
  }
}
