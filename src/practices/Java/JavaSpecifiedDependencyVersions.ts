import { PracticeBase } from '../PracticeBase';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeImpact, ProgrammingLanguage, PracticeEvaluationResult } from '../../model';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.SpecifiedDependencyVersions',
  name: 'Specify versions of dependencies',
  impact: PracticeImpact.high,
  suggestion: 'Set specific versions for the dependencies in your pom.xml or build.gradle',
  reportOnlyOnce: true,
  url: 'https://www.baeldung.com/maven-dependency-latest-version',
})
export class JavaSpecifiedDependencyVersions extends PracticeBase {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.packageInspector || !ctx.packageInspector.packages) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;

    for (const pkg of pkgs) {
      if (!pkg.lockfileVersion.value || !pkg.requestedVersion.value) {
        return PracticeEvaluationResult.notPracticing;
      }
    }

    return PracticeEvaluationResult.practicing;
  }
}
