import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { FirstTestPractice } from '.';
import { SecondTestPractice } from './SecondTestPractice.mock';
import { InvalidTestPractice } from './InvalidTestPractice.mock';

describe('Testing Practices', () => {
  let containerCtx: TestContainerContext;
  let firstPractice: FirstTestPractice;
  let secondPractice: SecondTestPractice;
  let invalidPractice: InvalidTestPractice;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('FirstTestPractice').to(FirstTestPractice);
    firstPractice = containerCtx.container.get('FirstTestPractice');

    containerCtx.container.bind('SecondTestPractice').to(SecondTestPractice);
    secondPractice = containerCtx.container.get('SecondTestPractice');

    containerCtx.container.bind('InvalidTestPractice').to(InvalidTestPractice);
    invalidPractice = containerCtx.container.get('InvalidTestPractice');
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

  it('Returns always practicing', async () => {
    const evaluated = await invalidPractice.evaluate();
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns always true', async () => {
    const isApplicable = await invalidPractice.isApplicable();
    expect(isApplicable).toEqual(true);
  });
});
