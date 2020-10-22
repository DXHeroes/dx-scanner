import { PracticeContext } from '../../contexts/practice/PracticeContext';
import {
  PracticeEvaluationResult,
  PracticeImpact,
  ProgrammingLanguage,
} from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { FixerContext } from '../../contexts/fixer/FixerContext';

@DxPractice({
  id: 'Go.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class GoGitignoreCorrectlySetPractice extends PracticeBase {
  private parsedGitignore: string[] = [];

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Go;
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

    // node_modules

    const exeFileRegex = this.parsedGitignore.find((value: string) =>
      /.exe$/.test(value),
    );
    const exeTiltFileRegex = this.parsedGitignore.find((value: string) =>
      /.exe~$/.test(value),
    );
    const dllFileRegex = this.parsedGitignore.find((value: string) =>
      /.dll$/.test(value),
    );
    const soFileRegex = this.parsedGitignore.find((value: string) =>
      /.so$/.test(value),
    );
    const dylibFileRegex = this.parsedGitignore.find((value: string) =>
      /.dylib$/.test(value),
    );
    const testFileRegex = this.parsedGitignore.find((value: string) =>
      /.test$/.test(value),
    );
    // misc
    const coverageRegex = parsedGitignore.find((value: string) =>
      /.out$/.test(value),
    );
    const dependencyRegex = parsedGitignore.find((value: string) =>
      /vendor/.test(value),
    );

    if (
      exeFileRegex &&
      exeTiltFileRegex &&
      dllFileRegex &&
      dylibFileRegex &&
      soFileRegex &&
      testFileRegex &&
      dependencyRegex &&
      coverageRegex
    ) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    const inspector = ctx.fileInspector?.basePath
      ? ctx.fileInspector
      : ctx.root.fileInspector;
    if (!inspector) return;
    // node_modules

    const exeFileRegex = this.parsedGitignore.find((value: string) =>
      /.exe$/.test(value),
    );
    const exeTiltFileRegex = this.parsedGitignore.find((value: string) =>
      /.exe~$/.test(value),
    );
    const dllFileRegex = this.parsedGitignore.find((value: string) =>
      /.dll$/.test(value),
    );
    const soFileRegex = this.parsedGitignore.find((value: string) =>
      /.so$/.test(value),
    );
    const dylibFileRegex = this.parsedGitignore.find((value: string) =>
      /.dylib$/.test(value),
    );
    const testFileRegex = this.parsedGitignore.find((value: string) =>
      /.test$/.test(value),
    );
    // misc
    const coverageRegex = this.parsedGitignore.find((value: string) =>
      /.out$/.test(value),
    );
    const dependencyRegex = this.parsedGitignore.find((value: string) =>
      /vendor/.test(value),
    );
    const fixes = [
      exeFileRegex ? undefined : '*.exe',
      exeTiltFileRegex ? undefined : '*.exe~',
      dllFileRegex ? undefined : '*.dll',
      soFileRegex ? undefined : '*.so',
      dylibFileRegex ? undefined : '*.dylib',
      testFileRegex ? undefined : '*.test',
      coverageRegex ? undefined : '*.out',
      dependencyRegex ? undefined : 'vendor/',
    ]
      .filter(Boolean)
      .concat(''); // append newline if we add something

    if (fixes.length > 1) fixes.unshift(''); // if there is something to add, make sure we start with newline

    await inspector.appendFile('.gitignore', fixes.join('\n'));
  }

  private setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text:
          'You should ignore the binaries for programs and plugins(.exe and others).Test binaries should also be ignored as well as .out file too along with the dependency directories',
      },
    ];
  }
}
