import { CLIEngine } from 'eslint';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { ESLintCorrectlyUsedPractice } from './ESLintCorrectlyUsed';
jest.mock('eslint');

describe('ESLintCorrectlyUsedPractice', () => {
  let practice: ESLintCorrectlyUsedPractice;
  let containerCtx: TestContainerContext;

  const mockedEslint = <jest.Mock>(<unknown>CLIEngine);

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ESLintCorrectlyUsedPractice').to(ESLintCorrectlyUsedPractice);
    practice = containerCtx.container.get('ESLintCorrectlyUsedPractice');
  });

  it('Returns practicing, if errorCount === 0', async () => {
    const report = { errorCount: 0 };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns not practicing, if errorCount !== 0', async () => {
    const report = { errorCount: 1 };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });
});
