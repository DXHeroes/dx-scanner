import { PracticeBase } from '../PracticeBase';

import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { ReportDetailType } from '../../reporters/ReporterData';
import { FixerContext } from '../../contexts/fixer/FixerContext';
import { IFileInspector } from '../../inspectors';

@DxPractice({
  id: 'Rust.GitignoreCorrectlySet',
  name: 'Set .gitignore correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore file as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Rust.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class RustGitignoreCorrectlySetPractice extends PracticeBase {
  private IGNORE_CHECKS: [RegExp, string][] = [
    [/target\//, 'target/'],
    [/\*\*\/\*\.rs\.bk/, '**/*.rs.bk'],
  ];

  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Rust;
  }

  private static async parseGitignore(fileInspector: IFileInspector): Promise<{ raw: string; rules: string[] }> {
    const raw = await fileInspector.readFile('.gitignore');
    const rules = raw.split('/\r?\n/').filter((line) => !line.startsWith('#') && line.trim() !== '');

    return {
      raw,
      rules,
    };
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const gitignore = await RustGitignoreCorrectlySetPractice.parseGitignore(ctx.root.fileInspector);
    const allFound = this.IGNORE_CHECKS.every(([regex, _]) => gitignore.rules.find((v) => regex.test(v)) !== undefined);

    if (allFound) {
      return PracticeEvaluationResult.practicing;
    }

    this.data.details = [
      {
        type: ReportDetailType.text,
        text: 'You should ignore the `target` folder, and for libraries also the `Cargo.lock` file.',
      },
    ];
    return PracticeEvaluationResult.notPracticing;
  }

  async fix(ctx: FixerContext) {
    const inspector = ctx.fileInspector?.basePath ? ctx.fileInspector : ctx.root.fileInspector;
    if (!inspector) return;

    const gitignore = await RustGitignoreCorrectlySetPractice.parseGitignore(inspector);
    const fixes = this.IGNORE_CHECKS.filter(([regex, _]) => gitignore.rules.find((v) => regex.test(v)) === undefined).map(
      ([_, fix]) => fix,
    );

    if (fixes.length > 0) {
      let fixesString = fixes.join('\n');
      if (fixesString.length > 0) {
        fixesString = '\n# added by `dx-scanner --fix`\n' + fixesString;
      }
      await inspector.writeFile('.gitignore', `${gitignore.raw}${fixesString}`);
    }
  }
}
