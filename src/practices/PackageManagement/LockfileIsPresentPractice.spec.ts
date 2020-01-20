import { LockfileIsPresentPractice } from './LockfileIsPresentPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('LockfileIsPresentPractice', () => {
  let containerCtx: TestContainerContext;
  let practice: LockfileIsPresentPractice;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('LockfileIsPresentPractice').to(LockfileIsPresentPractice);
    practice = containerCtx.container.get('LockfileIsPresentPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if there is a package-lock.json', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/package-lock.json': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing if there is a yarn.lock', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/yarn.lock': '...',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO lock file', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/not.exists': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is always applicable', async () => {
    const result = await practice.isApplicable();
    expect(result).toEqual(true);
  });
});
