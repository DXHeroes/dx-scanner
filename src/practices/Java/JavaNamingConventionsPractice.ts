import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import camelCase from 'camelcase';
import { Metadata } from '../../services/model';

@DxPractice({
  id: 'Java.NamingConventions',
  name: 'Use Java/Kotlin Naming Conventions',
  impact: PracticeImpact.small,
  suggestion: 'Java/Kotlin class names should begin capitalized as UpperCamelCase or PascalCase in a regular naming convention.',
  reportOnlyOnce: true,
  url: 'https://www.oracle.com/technetwork/java/codeconventions-135099.html',
})
export class JavaNamingConventionsPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const scannedFiles: Metadata[] = [];

    const regex = new RegExp('.(java|kt|kts)', 'i');
    const resultFiles = await ctx.fileInspector.scanFor(regex, '/', { shallow: false });
    resultFiles.forEach((file) => {
      scannedFiles.push(file);
    });

    if (scannedFiles.length === 0) {
      return PracticeEvaluationResult.unknown;
    }

    const incorrectFiles = [];

    scannedFiles.forEach((file) => {
      if (file.baseName !== 'build.gradle' && file.baseName !== 'settings.gradle') {
        const correctPascalCase = camelCase(file.baseName, { pascalCase: true });
        if (file.baseName !== correctPascalCase) {
          incorrectFiles.push(file.baseName);
        }
      }
    });

    if (incorrectFiles.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
