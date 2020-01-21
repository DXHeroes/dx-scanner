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
    return ctx.projectComponent.language === ProgrammingLanguage.Java;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }
    // for some reason the commented logic does not seem to regex correctly - debugger used
    // const regex = new RegExp('/.(xml|gradle)$', 'i');
    // const files = await ctx.fileInspector.scanFor(regex, '/', { shallow: true });
    // files.forEach((file) => {
    //   if (file.name.toLowerCase() === ('pom.xml' || 'build.gradle')) {
    //     return PracticeEvaluationResult.practicing;
    //   }
    // });

    if (await ctx.fileInspector.exists('pom.xml')) {
      return PracticeEvaluationResult.practicing;
    } else if (await ctx.fileInspector.exists('build.gradle')) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
