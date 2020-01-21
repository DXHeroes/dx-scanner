import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
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
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regex = new RegExp('*.(xml|gradle)$', 'i');

    console.log(regex);

    const files = await ctx.fileInspector.scanFor(regex, '/', { shallow: true });

    console.log(files);

    files.forEach((file) => {
      if (file.name.toLowerCase() === ('pom.xml' || 'build.gradle')) {
        return PracticeEvaluationResult.practicing;
      }
    });

    return PracticeEvaluationResult.notPracticing;
  }
}
