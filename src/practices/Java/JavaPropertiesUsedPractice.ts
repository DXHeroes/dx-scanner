import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.PropertiesUsed',
  name: 'Store Environment Properties Using .properties Files',
  impact: PracticeImpact.medium,
  suggestion:
    'Use files such as application.properties to store your sensitive key-value parameters & make sure that there are no syntax errors.',
  reportOnlyOnce: true,
  url: 'https://www.baeldung.com/java-properties',
})
export class JavaPropertiesUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const dotProperties = new RegExp('.(properties)', 'i');
    const propertiesFiles = await ctx.fileInspector.scanFor(dotProperties, '/', { shallow: false });

    if (propertiesFiles.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
