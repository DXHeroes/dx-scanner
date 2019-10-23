import { CLIEngine } from 'eslint';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import _ from 'lodash';
import yaml from 'js-yaml';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { inject } from 'inversify';
import { Types } from '../../types';
import { fs } from 'memfs';
import debug from 'debug';

@DxPractice({
  id: 'JavaScript.ESLintCorrectlyUsedPractice',
  name: 'Using ESLint Correctly',
  impact: PracticeImpact.medium,
  suggestion: 'Use the ESLint correctly. You have some errors.',
  reportOnlyOnce: true,
  url: 'https://eslint.org/',
  dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
})
export class ESLintWithoutErrorsPractice implements IPractice {
  // private readonly fileInspector: IFileInspector;

  // constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
  //   this.fileInspector = fileInspector;
  // }
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    let options: CLIEngine.Options = {
      fix: false, // Use auto-fixer
      useEslintrc: false, // Set to false so the project doesn't take the eslint config from home folder
      rules: {
        semi: 2,
      },
    };

    // Get the eslint config for component
    const eslintConfig = await ctx.fileInspector.scanFor(/\.eslintrc/, '/', { shallow: true });

    if (eslintConfig.length > 0) {
      let baseConfig, content;

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        baseConfig = require(eslintConfig[0].path);

        const plugins = _.clone(baseConfig.plugins);
        _.unset(baseConfig, 'plugins');
        _.unset(baseConfig, 'extends');
        options = { ...options, baseConfig, plugins };
      } catch (error) {
        debug(`Loading .eslintrc file failed with this error:\n${error}`);

        content = await ctx.fileInspector.readFile(eslintConfig[0].path);
        baseConfig = yaml.safeLoad(content);
      }
    }

    let eslintIgnore;
    if (typeof ctx.config !== 'string') {
      eslintIgnore = ctx.config && ctx.config.eslintIgnore;
    }
    if (eslintIgnore && eslintIgnore.length > 0) {
      options = { ...options, ignorePattern: eslintIgnore };
    } else {
      options = { ...options, ignorePattern: ['lib', 'dist', 'build'] };
    }

    if (ctx.projectComponent.language === ProgrammingLanguage.TypeScript) {
      options = { ...options, extensions: ['.ts'] };
    }
    if (ctx.projectComponent.language === ProgrammingLanguage.JavaScript) {
      options = { ...options, extensions: ['.js'] };
    }

    let cli, report;
    try {
      cli = new CLIEngine(options);
      report = cli.executeOnFiles([ctx.projectComponent.path]);
    } catch (error) {
      return PracticeEvaluationResult.unknown;
    }

    if (report['errorCount'] === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
