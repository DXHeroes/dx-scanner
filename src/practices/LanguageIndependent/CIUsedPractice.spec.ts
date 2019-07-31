import { MetadataType } from '../../services/model';
import { CIUsedPractice } from './CIUsedPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('CIUsedPractice', () => {
  let practice: CIUsedPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('CIUsedPractice').to(CIUsedPractice);
    practice = containerCtx.container.get('CIUsedPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('Returns practicing if there is a .gitlab-ci.yml', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        '.gitlab-ci.yml': {
          type: MetadataType.file,
          data: '...',
        },
      },
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO .gitlab-ci.yml', async () => {
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
