import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.LinterUsedPractice',
  name: 'Use a Java Linter Dependency',
  impact: PracticeImpact.small,
  suggestion: 'Use a linter for Maven or Gradle to keep pom.xml or build.gradle scripts clean and error-free.',
  reportOnlyOnce: true,
  url: 'https://github.com/nebula-plugins/gradle-lint-plugin/wiki',
})
export class JavaLinterUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.packageInspector) {
      return PracticeEvaluationResult.unknown;
    }

    if (ctx.packageInspector.hasOneOfPackages(['com.netflix.nebula:gradle-lint-plugin', 'com.lewisd:lint-maven-plugin'])) {
      return PracticeEvaluationResult.practicing;
    }
    return PracticeEvaluationResult.notPracticing;
  }
}
