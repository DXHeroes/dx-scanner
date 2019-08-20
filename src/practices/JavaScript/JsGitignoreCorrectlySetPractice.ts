import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'JavaScript.GitignoreCorrectlySet',
  name: 'Set .gitignore Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Scripts in the .gitignore set as usual.',
  reportOnlyOnce: true,
  url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
  dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
})
export class JsGitignoreCorrectlySetPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
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

    const buildRegex = parsedGitignore.find((value: string) => /build/.test(value));
    const debugRegex = parsedGitignore.find((value: string) => /debug/.test(value));
    const libRegex = parsedGitignore.find((value: string) => /lib/.test(value));
    const distRegex = parsedGitignore.find((value: string) => /dist/.test(value));
    const errorLogRegex = parsedGitignore.find((value: string) => /\.log/.test(value));
    const nodeModulesRegex = parsedGitignore.find((value: string) => /node_modules/.test(value));
    const packageJsonRegex = parsedGitignore.find((value: string) => /package-lock\.json/.test(value));
    const yarnLockRegex = parsedGitignore.find((value: string) => /yarn\.lock/.test(value));
    const coverageRegex = parsedGitignore.find((value: string) => /coverage/.test(value));
    const dsStoreRegex = parsedGitignore.find((value: string) => /\.DS_Store/.test(value));

    if (
      (buildRegex || libRegex || distRegex) &&
      (packageJsonRegex || yarnLockRegex) &&
      nodeModulesRegex &&
      debugRegex &&
      errorLogRegex &&
      coverageRegex &&
      dsStoreRegex
    ) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
