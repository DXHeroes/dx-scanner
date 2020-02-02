import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.LoggerUsedPractice',
  name: 'Use a Java Logging Dependency',
  impact: PracticeImpact.small,
  suggestion:
    'Use a logging library to avoid errors and even cyber attacks. The most widely used logging library in the Java community is Log4j 2.',
  reportOnlyOnce: true,
  url: 'https://logging.apache.org/log4j/2.x/',
})
export class JavaLoggerUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.packageInspector) {
      return PracticeEvaluationResult.unknown;
    }

    if (
      ctx.packageInspector.hasOneOfPackages([
        'org.apache.logging.log4j:log4j',
        'org.apache.logging.log4j:log4j-api',
        'org.apache.logging.log4j:log4j-core',
        'ch.qos.logback:logback-classic',
        'org.slf4j:slf4j-api',
      ])
    ) {
      return PracticeEvaluationResult.practicing;
    }
    return PracticeEvaluationResult.notPracticing;
  }
}
