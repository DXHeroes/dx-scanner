import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PackageManagerUtils } from '../utils/PackageManagerUtils';
import { defaultConfigFor } from 'prettier-default-config';
import { FixerContext } from '../../contexts/fixer/FixerContext';
import { IFileInspector } from '../../inspectors';

@DxPractice({
  id: 'JavaScript.PrettierUsed',
  name: 'Format your code automatically',
  impact: PracticeImpact.small,
  suggestion:
    'Use a tool for automated code formatting. For example, Prettier saves your time and energy and makes your code style consistent.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
})
export class PrettierUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      if (ctx.packageInspector.hasOneOfPackages(['prettier', 'prettier-eslint'])) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }

  async fix(ctx: FixerContext) {
    const inspector = ctx.fileInspector?.basePath ? ctx.fileInspector : ctx.root.fileInspector;
    if (!inspector) return;
    // install prettier
    await PackageManagerUtils.installPackage(inspector, 'prettier', { dev: true });
    // create default config
    const prettierConfigPresent = async (inspector: IFileInspector) => {
      const checks = await Promise.all(
        [
          '.prettierrc',
          '.prettierrc.json',
          '.prettierrc.yaml',
          '.prettierrc.yml',
          '.prettierrc.js',
          'prettier.config.js',
          '.prettierrc.toml',
        ].map((name) => inspector.exists(name)),
      );
      return checks.some(Boolean);
    };
    if (!(await prettierConfigPresent(inspector))) {
      const prettierConfig = JSON.stringify(defaultConfigFor('json'), null, 2);
      await inspector.writeFile('.prettierrc', prettierConfig);
    }
    // add npm script
    const packageJsonString = await inspector.readFile('package.json');
    const packageJson = JSON.parse(packageJsonString);
    if (!Object.keys(packageJson.scripts).includes('format')) {
      packageJson.scripts.format = 'prettier --check "**/*.js"';
      await inspector.writeFile('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
    }
  }
}
