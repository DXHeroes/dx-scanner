import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Java.NamingConventions',
  name: 'Use Java Naming Conventions',
  impact: PracticeImpact.small,
  suggestion: 'Java class names should begin capitalized as UpperCamelCase or PascalCase in a regular naming convention.',
  reportOnlyOnce: true,
  url: 'https://www.oracle.com/technetwork/java/codeconventions-135099.html',
})
export class JavaNamingConventionsPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexDotJava = new RegExp('.java', 'i');
    const javaFiles = await ctx.fileInspector.scanFor(regexDotJava, '/', { shallow: false });

    if (javaFiles.length === 0) {
      return PracticeEvaluationResult.unknown;
    }

    const incorrectFiles = [];

    javaFiles.forEach((file) => {
      const correctPascalCase = file.baseName.replace(/^\w/, (firstChar) => firstChar.toUpperCase());
      if (file.baseName !== correctPascalCase) {
        incorrectFiles.push(file.baseName);
      }
    });

    if (incorrectFiles.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
