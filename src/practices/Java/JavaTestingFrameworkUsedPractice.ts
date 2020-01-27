import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.TestingFrameworkUsedPractice',
  name: 'Use Testing Frameworks',
  impact: PracticeImpact.high,
  suggestion:
    'Use tests to point out the defects and errors that were made during the development phases. The most widely used testing frameworks in the Java community are JUnit and TestNG.',
  reportOnlyOnce: true,
  url: 'https://junit.org/junit5/',
})
export class JavaTestingFrameworkUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.packageInspector) {
      return PracticeEvaluationResult.unknown;
    }

    if (
      ctx.packageInspector.hasOneOfPackages([
        'junit:junit',
        'io.rest-assured:rest-assured',
        'org.testng:testng',
        'org.springframework:spring-test',
      ])
    ) {
      return PracticeEvaluationResult.practicing;
    }
    return PracticeEvaluationResult.notPracticing;
  }
}
