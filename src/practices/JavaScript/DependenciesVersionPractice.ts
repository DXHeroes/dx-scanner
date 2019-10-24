import { PracticeImpact, PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import _ from 'lodash';
import ncu from 'npm-check-updates';

@DxPractice({
  id: 'LanguageIndependent.DependenciesVersion',
  name: 'Updated Dependencies',
  impact: PracticeImpact.high,
  suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Try to use Renovate Bot.',
  reportOnlyOnce: true,
  url: 'https://renovatebot.com/',
})
export class DependenciesVersionPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.fileInspector === undefined || ctx.packageInspector === undefined) {
      return PracticeEvaluationResult.unknown;
    }

    const pkgs = ctx.packageInspector.packages;
    const fakePkgJson: { dependencies: { [key: string]: string } } = { dependencies: {} };

    pkgs &&
      pkgs.forEach((p) => {
        fakePkgJson.dependencies[p.name] = p.requestedVersion.value;
      });

    const result = await ncu.run({
      packageData: JSON.stringify(fakePkgJson),
    });

    if (_.keys(result).length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
