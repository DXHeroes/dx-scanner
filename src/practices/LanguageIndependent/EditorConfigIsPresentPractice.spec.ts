import { EditorConfigIsPresentPractice } from './EditorConfigIsPresentPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('EditorConfigIsPresentPractice', () => {
  let practice: EditorConfigIsPresentPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('EditorConfigIsPresentPractice').to(EditorConfigIsPresentPractice);
    practice = containerCtx.container.get('EditorConfigIsPresentPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if there is a .editorconfig', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/.editorconfig': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO .editorconfig', async () => {
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
});
