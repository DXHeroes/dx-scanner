import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { GitignoreCorrectlySetPracticeBase } from '../common/GitignoreCorrectlySetPracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';

@DxPractice({
  id: 'Java.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Java.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class JavaGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase {
  private javaArchitecture: 'Maven' | 'Gradle' | undefined;

  constructor() {
    const checkArch = (arch: 'Maven' | 'Gradle' | undefined, regex: RegExp, fix: string) => (ctx: PracticeContext, v: string) => {
      if (this.javaArchitecture !== arch || regex.test(v)) {
        return undefined;
      } else {
        return fix;
      }
    };

    super();
    this.applicableLanguages = [ProgrammingLanguage.Java, ProgrammingLanguage.Kotlin];
    this.ruleChecks = [
      // common
      { regex: /\*\.class/, fix: '*.class' },
      { regex: /\*\.war/, fix: '*.war' },
      { regex: /\*\.jar/, fix: '*.jar' },
      { regex: /\*\.log/, fix: '*.log' },
      // maven
      { check: checkArch('Maven', /\.mvn/, '*.mvn') },
      { check: checkArch('Maven', /buildNumber\.properties/, 'buildNumber.properties') },
      { check: checkArch('Maven', /target/, 'target/') },
      { check: checkArch('Maven', /pom\.xml\.tag/, 'pom.xml.tag') },
      { check: checkArch('Maven', /pom\.xml\.next/, 'pom.xml.next') },
      { check: checkArch('Maven', /release\.properties/, 'release.properties') },
      // gradle
      { check: checkArch('Gradle', /\.gradle/, '*.gradle') },
      { check: checkArch('Gradle', /gradle-app\.setting/, 'gradle-app.setting') },
      { check: checkArch('Gradle', /!gradle-wrapper\.jar/, '!gradle-wrapper.jar') },
      { check: checkArch('Gradle', /\.gradletasknamecache/, '.gradletasknamecache') },
    ];
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const fileInspector = await GitignoreCorrectlySetPracticeBase.checkFileInspector(ctx);
    if (!fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    if (await fileInspector.exists('pom.xml')) {
      this.javaArchitecture = 'Maven';
    } else if ((await fileInspector.exists('build.gradle')) || (await fileInspector.exists('build.gradle.kts'))) {
      this.javaArchitecture = 'Gradle';
    }

    return super.evaluate(ctx);
  }

  protected setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text: 'You should ignore generated java artifacts (.class, .jar, .war) and maven- or gradle-specific files.',
      },
    ];
  }
}
