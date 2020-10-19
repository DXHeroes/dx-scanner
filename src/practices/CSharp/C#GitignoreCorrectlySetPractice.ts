import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { FixerContext } from '../../contexts/fixer/FixerContext';

@DxPractice({
  id: 'CSharp.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/VisualStudio.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class CSharpGitignoreCorrectlySetPractice extends PracticeBase {
  private parsedGitignore: string[] = [];

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.CSharp;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.root.fileInspector) return PracticeEvaluationResult.unknown;

    const parseGitignore = (gitignoreFile: string) => {
      return gitignoreFile
        .toString()
        .split(/\r?\n/)
        .filter((content) => content.trim() !== '' && !content.startsWith('#'));
    };
    const content = await ctx.root.fileInspector.readFile('.gitignore');
    const parsedGitignore = parseGitignore(content);
    this.parsedGitignore = parsedGitignore;

    // binary and cache files
    const binaryRegex = parsedGitignore.find((value: string) => /(?:\[Bb\]|b|B)in/.test(value));
    const cacheRegex = parsedGitignore.find((value: string) => /(?:\[Cc\]|C|c)ache/.test(value));
    const objectRegex = parsedGitignore.find((value: string) => /(?:\[Oo\]|O|o)bj/.test(value));
    // user generated
    const userRegex = parsedGitignore.find((value: string) => /\*\.user/.test(value));
    const suoRegex = parsedGitignore.find((value: string) => /\*\.suo/.test(value));
    const logRegex = parsedGitignore.find((value: string) => /\*\.log/.test(value));

    if (binaryRegex && cacheRegex && objectRegex && userRegex && suoRegex && logRegex) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    const inspector = ctx.fileInspector?.basePath ? ctx.fileInspector : ctx.root.fileInspector;
    if (!inspector) return;

    // binary and cache files
    const binaryRegex = this.parsedGitignore.find((value: string) => /^(?:\[Bb\]|b|B)in\b/.test(value));
    const cacheRegex = this.parsedGitignore.find((value: string) => /^(?:\[Cc\]|C|c)ache\b/.test(value));
    const objectRegex = this.parsedGitignore.find((value: string) => /^(?:\[Oo\]|O|o)bj\b/.test(value));
    // user generated
    const userRegex = this.parsedGitignore.find((value: string) => /^\*\.user\b/.test(value));
    const suoRegex = this.parsedGitignore.find((value: string) => /^\*\.suo\b/.test(value));
    const logRegex = this.parsedGitignore.find((value: string) => /\*\.log/.test(value));

    const fixes = [
      binaryRegex ? undefined : '[Bb]in/',
      cacheRegex ? undefined : '[Cc]ache/',
      objectRegex ? undefined : '[Oo]bj/',
      userRegex ? undefined : '*.user',
      suoRegex ? undefined : '*.suo',
      logRegex ? undefined : '*.log',
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
        text: 'You should ignore bin, cache and obj folders and user (*.user), suo (*.suo) and log (*.log) files',
      },
    ];
  }
}
