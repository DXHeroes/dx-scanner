import { JsPackageManagementUsedPractice } from './JsPackageManagementUsedPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('JsPackageManagementUsedPractice', () => {
  let practice: JsPackageManagementUsedPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JsPackageManagementUsedPractice').to(JsPackageManagementUsedPractice);
    practice = containerCtx.container.get('JsPackageManagementUsedPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('Returns practicing if there is a package.json', async () => {
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO package.json', async () => {
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
