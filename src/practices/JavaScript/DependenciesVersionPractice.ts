import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { evaluateBySemverLevel, SemverVersion } from '../../detectors/utils';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'LanguageIndependent.DependenciesVersionMajorLevel',
  name: 'Update Dependencies of Major Level',
  impact: PracticeImpact.small,
  suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Use, for example, Renovate Bot.',
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
    return evaluateBySemverLevel(ctx, SemverVersion.major);
  }
}
