import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'JavaScript.TypeScriptUsed',
  name: 'Write in Typescript',
  impact: PracticeImpact.medium,
  suggestion:
    'Start writing in TypeScript to catch errors during compile-time. TypeScript simplifies JavaScript code, making it easier to read and debug.',
  reportOnlyOnce: true,
  url: 'https://www.typescriptlang.org/',
})
export class TypeScriptUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.JavaScript;
  }

  async evaluate(): Promise<PracticeEvaluationResult> {
    // Always match this for JavaScript
    return PracticeEvaluationResult.notPracticing;
  }
}
