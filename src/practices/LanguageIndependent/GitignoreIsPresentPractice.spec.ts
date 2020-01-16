import { GitignoreIsPresentPractice } from './GitignoreIsPresentPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('GitignoreIsPresentPractice', () => {
  let practice: GitignoreIsPresentPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('GitignoreIsPresentPractice').to(GitignoreIsPresentPractice);
    practice = containerCtx.container.get('GitignoreIsPresentPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if there is a .gitignore', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/.gitignore': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO .gitignore', async () => {
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
