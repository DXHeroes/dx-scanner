import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Scripts in the .gitignore set as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
  //dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class JavaGitignoreCorrectlySetPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
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

    if (await ctx.fileInspector.exists('pom.xml')) {
      const mvnRegex = parsedGitignore.find((value: string) => /\.mvn/.test(value));
      const buildNumberRegex = parsedGitignore.find((value: string) => /buildNumber/.test(value));
      const dependencyRegex = parsedGitignore.find((value: string) => /dependency-reduced-pom\.xml/.test(value));
      const targetRegex = parsedGitignore.find((value: string) => /target/.test(value));
      const pomTagRegex = parsedGitignore.find((value: string) => /pom\.xml\.tag/.test(value));
      const pomReleaseBackupRegex = parsedGitignore.find((value: string) => /pom\.xml\.releaseBackup/.test(value));
      const pomVersionsBackupRegex = parsedGitignore.find((value: string) => /pom\.xml\.versionsBackup/.test(value));
      const pomNextRegex = parsedGitignore.find((value: string) => /pom\.xml\.next/.test(value));
      const releaseRegex = parsedGitignore.find((value: string) => /release\.properties/.test(value));

      if (
        mvnRegex &&
        buildNumberRegex &&
        dependencyRegex &&
        targetRegex &&
        pomTagRegex &&
        pomReleaseBackupRegex &&
        pomVersionsBackupRegex &&
        pomNextRegex &&
        releaseRegex
      ) {
        return PracticeEvaluationResult.practicing;
      }
    } else if (await ctx.fileInspector.exists('build.gradle')) {
      const gradleRegex = parsedGitignore.find((value: string) => /\.gradle/.test(value));
      const gradleAppRegex = parsedGitignore.find((value: string) => /gradle-app\.setting/.test(value));
      const gradleWrapperRegex = parsedGitignore.find((value: string) => /!gradle-wrapper\.jar/.test(value));
      const taskNameCacheRegex = parsedGitignore.find((value: string) => /\.gradletasknamecache/.test(value));

      if (gradleRegex && gradleAppRegex && gradleWrapperRegex && taskNameCacheRegex) {
        return PracticeEvaluationResult.practicing;
      }
    }
    return PracticeEvaluationResult.notPracticing;
  }
}
