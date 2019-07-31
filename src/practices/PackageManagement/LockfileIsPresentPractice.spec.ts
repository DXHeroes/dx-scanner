import { MetadataType } from '../../services/model';
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
  });

  it('Returns practicing if there is a package-lock.json', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        'package-lock.json': {
          type: MetadataType.file,
          data: '...',
        },
      },
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing if there is a yarn.lock', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        'yarn.lock': {
          type: MetadataType.file,
          data: '...',
        },
      },
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO lock file', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        'not.exists': {
          type: MetadataType.file,
          data: '...',
        },
      },
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });
});
