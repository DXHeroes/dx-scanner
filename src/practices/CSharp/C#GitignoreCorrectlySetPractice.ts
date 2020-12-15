import { PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';

@DxPractice({
  id: 'CSharp.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/VisualStudio.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class CSharpGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
  constructor() {
    super();

    this.applicableLanguages = [ProgrammingLanguage.CSharp];
    this.ruleChecks = [
      // binary and cache files
      { regex: /(?:\[Bb\]|b|B)in\b/, fix: '[Bb]in/' },
      { regex: /(?:\[Cc\]|C|c)ache\b/, fix: '[Cc]ache/' },
      { regex: /(?:\[Oo\]|O|o)bj\b/, fix: '[Oo]bj/' },
      // user generated
      { regex: /\*\.user\b/, fix: '*.user' },
      { regex: /\*\.suo\b/, fix: '*.suo' },
      { regex: /\*\.log/, fix: '*.log' },
    ];
  }

  protected setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text: 'You should ignore bin, cache and obj folders and user (*.user), suo (*.suo) and log (*.log) files',
      },
    ];
  }
}
