import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';

@DxPractice({
  id: 'JavaScript.PackageJsonConfigurationSetCorrectly',
  name: 'Configure Scripts in package.json',
  impact: PracticeImpact.medium,
  suggestion:
    'Use correct configurations to automate repetitive tasks. Use build for automating the build process, lint for linting your code, tests for testing and start for running your project.',
  reportOnlyOnce: true,
  url: 'https://docs.npmjs.com/files/package.json',
  dependsOn: { practicing: ['Javascript.PackageManagementUsed'] },
})
export class JsPackageJsonConfigurationSetCorrectlyPractice extends PracticeBase {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const content = await ctx.fileInspector.readFile('/package.json');
    let parsedPackageJson;

    if (content) {
      try {
        parsedPackageJson = JSON.parse(content);
      } catch (error) {
        if (error instanceof SyntaxError) {
          return PracticeEvaluationResult.unknown;
        }
        throw error;
      }
    }

    if (
      parsedPackageJson.scripts &&
      parsedPackageJson.scripts.test &&
      parsedPackageJson.scripts.lint &&
      parsedPackageJson.scripts.build &&
      parsedPackageJson.scripts.start
    ) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  private setData() {
    this.data.details = [
      { type: ReportDetailType.text, text: "The package.json doesn't have configured scripts correctly. The most common scripts are build, start, test and lint." }
    ];
  }
}
