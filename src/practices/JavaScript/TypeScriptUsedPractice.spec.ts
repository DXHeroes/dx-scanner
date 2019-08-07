import { ProgrammingLanguage } from '../../model';
import { TypeScriptUsedPractice } from './TypeScriptUsedPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('TypeScriptUsedPractice', () => {
  let practice: TypeScriptUsedPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('TypeScriptUsedPractice').to(TypeScriptUsedPractice);
    practice = containerCtx.container.get('TypeScriptUsedPractice');
  });

  it('Returns true if the language is TypeScript', async () => {
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Returns false if the language is NOT JavaScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.UNKNOWN;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });

  it('Returns notPracticing if the TypeScript is not used', async () => {
    const result = await practice.evaluate();
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });
});
