import eslint from 'eslint';
import { inject } from 'inversify';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { ArgumentsProvider } from '../../inversify.config';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { Types } from '../../types';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'JavaScript.ESLintCorrectlyUsed',
  name: 'Using ESLint Correctly',
  impact: PracticeImpact.medium,
  suggestion: 'Use the ESLint correctly. You have some warnings/errors.',
  reportOnlyOnce: true,
  url: 'https://eslint.org/',
  dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
})
export class ESLintCorrectlyUsedPractice implements IPractice {
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
  }
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const CLIEngine = eslint.CLIEngine;
    let cli;
    // if (ctx.fileInspector !== undefined) {
    //   await ctx.fileInspector.flatTraverse('lib/', (files) => {
    //     console.log(files.path, 'files.path');
    //   });
    // }
    cli = new CLIEngine({});
    const globPatterns = cli.resolveFileGlobPatterns(['lib/']);
    console.log(globPatterns);
    const fileToIgnore = globPatterns[0];

    if (ctx.projectComponent.language === ProgrammingLanguage.TypeScript) {
      cli = new CLIEngine({
        extensions: ['.ts'],
        useEslintrc: true,
        //ignorePath: 'lib/**/*.{js}',
        rules: {
          semi: 2,
        },
      });
    } else {
      cli = new CLIEngine({
        extensions: ['.js'],
        useEslintrc: true,
        ignorePath: 'lib/',
        rules: {
          semi: 2,
        },
      });
    }
    console.log(ctx.projectComponent.path, 'ctx.projectComponent.path');
    console.log(this.argumentsProvider.uri, 'uri');

    const path = process.cwd();
    console.log(__dirname, 'dirname');

    const report = cli.executeOnFiles([path]);

    if (report['errorCount'] === 0 && report['warningCount'] === 0) {
      return PracticeEvaluationResult.practicing;
    }

    console.log(report['errorCount']);
    console.log(report['warningCount']);

    return PracticeEvaluationResult.unknown;
  }
}
