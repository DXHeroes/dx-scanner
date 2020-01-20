import { DockerizationUsedPractice } from './DockerizationUsedPractice';
import { PracticeEvaluationResult, ProjectComponentType } from '../../model';
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
    containerCtx.practiceContext.fileInspector!.purgeCache();
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

  it('Is applicable if projectComponentType is not a library ', async () => {
    containerCtx.practiceContext.projectComponent.type = ProjectComponentType.Application;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable if projectComponentType is a library ', async () => {
    containerCtx.practiceContext.projectComponent.type = ProjectComponentType.Library;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
