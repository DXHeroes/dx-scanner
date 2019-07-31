import { MetadataType } from '../../services/model';
import { ReadmeIsPresentPractice } from './ReadmeIsPresentPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('ReadmePracticeIsPresentPractice', () => {
  let practice: ReadmeIsPresentPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ReadmeIsPresentPractice').to(ReadmeIsPresentPractice);
    practice = containerCtx.container.get('ReadmeIsPresentPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('Returns practicing if there is a readme', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        'readme.anything': {
          type: MetadataType.file,
          data: '...',
        },
      },
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO readme', async () => {
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
