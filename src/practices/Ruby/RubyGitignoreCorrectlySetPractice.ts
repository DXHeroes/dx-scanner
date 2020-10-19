import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { FixerContext } from '../../contexts/fixer/FixerContext';

@DxPractice({
  id: 'Ruby.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Ruby.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class RubyGitignoreCorrectlySetPractice extends PracticeBase {
  private parsedGitignore: string[] = [];

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Ruby;
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
    const coverageRegex = parsedGitignore.find((value: string) => /\/coverage\//.test(value));
    const temporaryRegex = parsedGitignore.find((value: string) => /\/tmp\//.test(value));
    const configRegex = parsedGitignore.find((value: string) => /\/\.config/.test(value));
    // user generated
    const rbcRegex = parsedGitignore.find((value: string) => /\*\.rbc/.test(value));
    const gemRegex = parsedGitignore.find((value: string) => /\*\.gem/.test(value));

    if (coverageRegex && temporaryRegex && configRegex && rbcRegex && gemRegex) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    const inspector = ctx.fileInspector?.basePath ? ctx.fileInspector : ctx.root.fileInspector;
    if (!inspector) return;

    // binary and cache files
    const coverageRegex = this.parsedGitignore.find((value: string) => /\/coverage\//.test(value));
    const temporaryRegex = this.parsedGitignore.find((value: string) => /\/tmp\//.test(value));
    const configRegex = this.parsedGitignore.find((value: string) => /\/\.config/.test(value));
    // user generated
    const rbcRegex = this.parsedGitignore.find((value: string) => /\*\.rbc/.test(value));
    const gemRegex = this.parsedGitignore.find((value: string) => /\*\.gem/.test(value));

    const fixes = [
      coverageRegex ? undefined : '/coverage/',
      temporaryRegex ? undefined : '/tmp/',
      configRegex ? undefined : '/.config',
      rbcRegex ? undefined : '*.rbc',
      gemRegex ? undefined : '*.gem',
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
        text: 'You should ignore log, coverage, tmp and .config folders and rbc (*.rbc) and gem (*.gem) files',
      },
    ];
  }
}
