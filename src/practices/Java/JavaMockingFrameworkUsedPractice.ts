import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.MockingFrameworkUsedPractice',
  name: 'Use Mocking Frameworks for Tests',
  impact: PracticeImpact.medium,
  suggestion: 'Use mocking frameworks such as Mockito or JMock to improve your tests.',
  reportOnlyOnce: true,
  url: 'https://site.mockito.org/',
})
export class JavaMockingFrameworkUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.packageInspector) {
      return PracticeEvaluationResult.unknown;
    }
    // include the group ID and artifact ID when searching for packages in Java in dxs
    if (
      ctx.packageInspector.hasOneOfPackages([
        'org.testifyproject.mock:mockito',
        'org.mockito:mockito-core',
        'org.powermock:powermock',
        'org.powermock:powermock-core',
        'org.jmock:jmock',
        'org.jmock:jmock-parent',
        'org.easymock:easymock',
        'org.easymock:easymock-parent',
        'org.jmockit:jmockit',
        'com.googlecode.jmockit:jmockit',
        'mockit:jmockit',
      ])
    ) {
      return PracticeEvaluationResult.practicing;
    }
    return PracticeEvaluationResult.notPracticing;
  }
}
