import { PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { ReportDetailType } from '../../reporters/ReporterData';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';

@DxPractice({
  id: 'JavaScript.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class JsGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
  constructor() {
    super();
    this.applicableLanguages = [ProgrammingLanguage.JavaScript];
    this.ruleChecks = [
      // node_modules
      { regex: /node_modules/, fix: '/node_modules' },
      // misc
      { regex: /coverage/, fix: '/coverage' },
      { regex: /\.log/, fix: '*.log' },
    ];
  }

  protected setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text:
          'You should ignore one of the lock files (package-lock.json or yarn.lock), node_modules folder, coverage folder and log files (*.log)',
      },
    ];
  }
}
