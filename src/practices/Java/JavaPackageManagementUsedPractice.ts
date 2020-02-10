import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.PackageManagementUsed',
  name: 'Use Java Package Management',
  impact: PracticeImpact.high,
  suggestion: 'Use pom.xml or build.gradle to keep track of packages that are being used in your application.',
  reportOnlyOnce: true,
  url: 'https://maven.apache.org/',
})
export class JavaPackageManagementUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    if (await ctx.fileInspector.exists('pom.xml')) {
      return PracticeEvaluationResult.practicing;
    } else if (await ctx.fileInspector.exists('build.gradle')) {
      return PracticeEvaluationResult.practicing;
    } else if (await ctx.fileInspector.exists('build.gradle.kts')) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
