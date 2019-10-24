import { PracticeEvaluationResult } from '../../model';
import { DependenciesVersionPractice } from './DependenciesVersionPractice';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import ncu from 'npm-check-updates';
jest.mock('npm-check-updates');

describe('DependenciesVersionPractice', () => {
  let practice: DependenciesVersionPractice;
  let containerCtx: TestContainerContext;
  const mockedNcu = <jest.Mock>ncu.run;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DependenciesVersionPractice').to(DependenciesVersionPractice);
    practice = containerCtx.container.get('DependenciesVersionPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('not practicing if newer package versions exists', async () => {
    mockedNcu.mockImplementation(() => {
      return { 'ts-node': '^8', typescript: '^3' };
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('practicing if newest package version dependency', async () => {
    mockedNcu.mockImplementation(() => {
      return {};
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });
});
