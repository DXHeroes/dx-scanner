import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Javascript.PackageManagementUsed',
  name: 'Use JS Package Management',
  impact: PracticeImpact.high,
  suggestion: 'Use Package.json to keep track of packages that are being used in your application.',
  reportOnlyOnce: true,
  url: 'https://docs.npmjs.com/files/package.json',
})
export class JsPackageManagementUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const regexPjson = new RegExp('package.json', 'i');

    const files = await ctx.fileInspector.scanFor(regexPjson, '/', { shallow: true });
    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
