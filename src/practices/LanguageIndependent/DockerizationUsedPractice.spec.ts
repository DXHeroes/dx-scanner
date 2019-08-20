import { DockerizationUsedPractice } from './DockerizationUsedPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('DockerizationUsedPractice', () => {
  let practice: DockerizationUsedPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DockerizationUsedPractice').to(DockerizationUsedPractice);
    practice = containerCtx.container.get('DockerizationUsedPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('Returns practicing if the docker is used', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      Dockerfile: '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if the docker is NOT used', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'not.exists': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });
});
