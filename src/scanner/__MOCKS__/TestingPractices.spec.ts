import { FirstTestPractice } from '.';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { SecondTestPractice } from './SecondTestPractice.mock';

describe('Testing Practices', () => {
  let containerCtx: TestContainerContext;
  let firstPractice: FirstTestPractice;
  let secondPractice: SecondTestPractice;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('FirstTestPractice').to(FirstTestPractice);
    firstPractice = containerCtx.container.get('FirstTestPractice');

    containerCtx.container.bind('SecondTestPractice').to(SecondTestPractice);
    secondPractice = containerCtx.container.get('SecondTestPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns always practicing', async () => {
    const evaluated = await firstPractice.evaluate();
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns always true', async () => {
    const isApplicable = await firstPractice.isApplicable();
    expect(isApplicable).toEqual(true);
  });

  it('Returns always practicing', async () => {
    const evaluated = await secondPractice.evaluate();
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns always true', async () => {
    const isApplicable = await secondPractice.isApplicable();
    expect(isApplicable).toEqual(true);
  });
});
