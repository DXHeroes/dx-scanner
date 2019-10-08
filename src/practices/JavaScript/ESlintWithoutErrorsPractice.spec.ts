import { CLIEngine } from 'eslint';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { ESLintWithoutErrorsPractice } from './ESLintWithoutErrorsPractice';
jest.mock('eslint');

describe('ESLintWithoutErrorsPractice', () => {
  let practice: ESLintWithoutErrorsPractice;
  let containerCtx: TestContainerContext;

  const mockedEslint = <jest.Mock>(<unknown>CLIEngine);

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
    practice = containerCtx.container.get('ESLintWithoutErrorsPractice');
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
