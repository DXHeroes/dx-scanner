import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Set patterns in the .gitignore as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Java.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class JavaGitignoreCorrectlySetPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const parseGitignore = (gitignoreFile: string) => {
      return gitignoreFile
        .toString()
        .split(/\r?\n/)
        .filter((content) => content.trim() !== '' && !content.startsWith('#'));
    };

    const content = await ctx.fileInspector.readFile('.gitignore');
    const parsedGitignore = parseGitignore(content);

    const compiledClassRegex = parsedGitignore.find((value: string) => /\*\.class/.test(value));
    const logRegex = parsedGitignore.find((value: string) => /\*\.log/.test(value));
    const jarRegex = parsedGitignore.find((value: string) => /\*\.jar/.test(value));
    const warRegex = parsedGitignore.find((value: string) => /\*\.war/.test(value));

    if (!(compiledClassRegex && logRegex && jarRegex && warRegex)) {
      return PracticeEvaluationResult.notPracticing;
    }

    if (await ctx.fileInspector.exists('pom.xml')) {
      if (await this.resolveGitignorePractice(parsedGitignore, 'Maven')) {
        return PracticeEvaluationResult.practicing;
      }
    } else if (await ctx.fileInspector.exists('build.gradle')) {
      if (await this.resolveGitignorePractice(parsedGitignore, 'Gradle')) {
        return PracticeEvaluationResult.practicing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }

  private async resolveGitignorePractice(parsedGitignore: string[], javaArchitecture: string) {
    if (javaArchitecture === 'Maven') {
      const mvnRegex = parsedGitignore.find((value: string) => /\.mvn/.test(value));
      const buildNumberRegex = parsedGitignore.find((value: string) => /buildNumber/.test(value));
      const targetRegex = parsedGitignore.find((value: string) => /target/.test(value));
      const pomTagRegex = parsedGitignore.find((value: string) => /pom\.xml\.tag/.test(value));
      const pomNextRegex = parsedGitignore.find((value: string) => /pom\.xml\.next/.test(value));
      const releaseRegex = parsedGitignore.find((value: string) => /release\.properties/.test(value));
      if (mvnRegex && buildNumberRegex && targetRegex && pomTagRegex && pomNextRegex && releaseRegex) {
        return true;
      }
    } else if (javaArchitecture === 'Gradle') {
      const gradleRegex = parsedGitignore.find((value: string) => /\.gradle/.test(value));
      const gradleAppRegex = parsedGitignore.find((value: string) => /gradle-app\.setting/.test(value));
      const gradleWrapperRegex = parsedGitignore.find((value: string) => /!gradle-wrapper\.jar/.test(value));
      const taskNameCacheRegex = parsedGitignore.find((value: string) => /\.gradletasknamecache/.test(value));
      if (gradleRegex && gradleAppRegex && gradleWrapperRegex && taskNameCacheRegex) {
        return true;
      }
    }
    return false;
  }
}
