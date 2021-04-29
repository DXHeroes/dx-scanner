import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { ReportDetailType } from '../../reporters/ReporterData';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';

@DxPractice({
  id: 'Rust.GitignoreCorrectlySet',
  name: 'Set .gitignore correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore file as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Rust.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class RustGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
  constructor() {
    super();
    this.applicableLanguages = [ProgrammingLanguage.Rust];
    this.ruleChecks = [
      { regex: /target\//, fix: 'target/' },
      { regex: /\*\*\/\*\.rs\.bk/, fix: '**/*.rs.bk' },
    ];
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const result = await super.evaluate(ctx);

    if (result === PracticeEvaluationResult.notPracticing) {
      this.setData();
    }
    return result;
  }

  protected setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text: 'You should ignore the `target` folder, and for libraries also the `Cargo.lock` file.',
      },
    ];
  }
}
