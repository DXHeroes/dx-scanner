import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { ReportDetailType } from '../../reporters/ReporterData';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';

@DxPractice({
  id: 'Ruby.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Ruby.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class RubyGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
  constructor() {
    super();
    this.applicableLanguages = [ProgrammingLanguage.Ruby];
    this.ruleChecks = [
      // binary and cache files
      { regex: /\/coverage\//, fix: '/coverage/' },
      { regex: /\/tmp\//, fix: '/tmp/' },
      { regex: /\/\.config/, fix: '/.config' },
      // user generated
      { regex: /\*\.rbc/, fix: '*.rbc' },
      { regex: /\*\.gem/, fix: '*.gem' },
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
        text: 'You should ignore log, coverage, tmp and .config folders and rbc (*.rbc) and gem (*.gem) files',
      },
    ];
  }
}
