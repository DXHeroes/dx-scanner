import { MetadataType } from '../../services/model';
import { JsGitignoreCorrectlySetPractice } from './JsGitignoreCorrectlySetPractice';
import { gitignoreContent } from '../../detectors/__MOCKS__/gitignoreContent.mock';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('JsGitignoreCorrectlySetPractice', () => {
  let practice: JsGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JsGitignoreCorrectlySetPractice').to(JsGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('JsGitignoreCorrectlySetPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('Returns practicing if the .gitignore is set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        '.gitignore': {
          type: MetadataType.file,
          data: gitignoreContent,
        },
      },
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there the .gitignore is NOT set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        '.gitignore': {
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
