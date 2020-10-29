import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { FixerContext } from '../../contexts/fixer/FixerContext';

@DxPractice({
  id: 'CPlusPlus.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/C%2B%2B.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class JsGitignoreCorrectlySetPractice extends PracticeBase {
  private parsedGitignore: string[] = [];

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.CPlusPlus;
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

    // Prerequisites
    const prerequisitesRegex = parsedGitignore.find((value: string) => /\.d$/.test(value));

    // compiled object files
    const sloRegex = parsedGitignore.find((value:string) => /\.slo$/.test(value));
    const loRegex = parsedGitignore.find((value:string) => /\.lo$/.test(value));
    const oRegex = parsedGitignore.find((value:string) => /\.o$/.test(value));
    const objRegex = parsedGitignore.find((value:string) => /\.obj$/.test(value));

    // precompiled headers
    const gchHeaderRegex = parsedGitignore.find((value:string) => /\.gch$/.test(value));
    const pchHeaderRegex = parsedGitignore.find((value:string) => /\.pch$/.test(value));

    // dynamic libraries
    const soRegex = parsedGitignore.find((value:string) => /\.so$/.test(value));
    const dylibRegex = parsedGitignore.find((value:string) => /\.dylib$/.test(value));
    const dllRegex = parsedGitignore.find((value:string) => /\.dll$/.test(value));

    // fortran module files
    const modRegex = parsedGitignore.find((value:string) => /\.mod$/.test(value));
    const smodRegex = parsedGitignore.find((value:string) => /\.smod$/.test(value));

    // compiled static
    const laiRegex = parsedGitignore.find((value:string) => /\.lai$/.test(value));
    const laRegex = parsedGitignore.find((value:string) => /\.la$/.test(value));
    const aRegex = parsedGitignore.find((value:string) => /\.a$/.test(value));
    const libRegex = parsedGitignore.find((value:string) => /\.lib$/.test(value));

    // executables
    const exeRegex = parsedGitignore.find((value:string) => /\.exe$/.test(value));
    const outRegex = parsedGitignore.find((value:string) => /\.out$/.test(value));
    const appRegex = parsedGitignore.find((value:string) => /\.app$/.test(value));

    if (prerequisitesRegex &&
      sloRegex &&
      loRegex &&
      oRegex &&
      objRegex &&
      gchHeaderRegex &&
      pchHeaderRegex &&
      soRegex &&
      dylibRegex &&
      dllRegex &&
      modRegex &&
      smodRegex &&
      laiRegex &&
      laRegex &&
      aRegex &&
      libRegex &&
      exeRegex &&
      outRegex &&
      appRegex
    ) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    const inspector = ctx.fileInspector?.basePath ? ctx.fileInspector : ctx.root.fileInspector;
    if (!inspector) return;

    // Prerequisites
    const prerequisitesRegex = this.parsedGitignore.find((value: string) => /\.d$/.test(value));

    // compiled object files
    const sloRegex = this.parsedGitignore.find((value:string) => /\.slo$/.test(value));
    const loRegex = this.parsedGitignore.find((value:string) => /\.lo$/.test(value));
    const oRegex = this.parsedGitignore.find((value:string) => /\.o$/.test(value));
    const objRegex = this.parsedGitignore.find((value:string) => /\.obj$/.test(value));

    // precompiled headers
    const gchHeaderRegex = this.parsedGitignore.find((value:string) => /\.gch$/.test(value));
    const pchHeaderRegex = this.parsedGitignore.find((value:string) => /\.pch$/.test(value));

    // dynamic libraries
    const soRegex = this.parsedGitignore.find((value:string) => /\.so$/.test(value));
    const dylibRegex = this.parsedGitignore.find((value:string) => /\.dylib$/.test(value));
    const dllRegex = this.parsedGitignore.find((value:string) => /\.dll$/.test(value));

    // fortran module files
    const modRegex = this.parsedGitignore.find((value:string) => /\.mod$/.test(value));
    const smodRegex = this.parsedGitignore.find((value:string) => /\.smod$/.test(value));

    // compiled static
    const laiRegex = this.parsedGitignore.find((value:string) => /\.lai$/.test(value));
    const laRegex = this.parsedGitignore.find((value:string) => /\.la$/.test(value));
    const aRegex = this.parsedGitignore.find((value:string) => /\.a$/.test(value));
    const libRegex = this.parsedGitignore.find((value:string) => /\.lib$/.test(value));

    // executables
    const exeRegex = this.parsedGitignore.find((value:string) => /\.exe$/.test(value));
    const outRegex = this.parsedGitignore.find((value:string) => /\.out$/.test(value));
    const appRegex = this.parsedGitignore.find((value:string) => /\.app$/.test(value));

    const fixes = [
      prerequisitesRegex  ? undefined: '*.d',
      sloRegex  ? undefined: '*.slo',
      loRegex  ? undefined: '*.lo',
      oRegex  ? undefined: '*.o',
      objRegex  ? undefined: '*.obj',
      gchHeaderRegex  ? undefined: '*.gch',
      pchHeaderRegex  ? undefined: '*.pch',
      soRegex  ? undefined: '*.so',
      dylibRegex  ? undefined: '*.dylib',
      dllRegex  ? undefined: '*.dll',
      modRegex  ? undefined: '*.mod',
      smodRegex  ? undefined: '*.smod',
      laiRegex  ? undefined: '*.lai',
      laRegex  ? undefined: '*.la',
      aRegex  ? undefined: '*.a',
      libRegex  ? undefined: '*.lib',
      exeRegex  ? undefined: '*.exe',
      outRegex  ? undefined: '*.out',
      appRegex ? undefined: '*.app',
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
          'One should ignore the prerequisites, compiled object files, precompiled headers, compiled static and dynamic libraries, fortran module files and executables.',
      },
    ];
  }
}
