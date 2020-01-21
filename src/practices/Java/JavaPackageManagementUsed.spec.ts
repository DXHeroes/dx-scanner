import { JavaPackageManagementUsedPractice } from './JavaPackageManagementUsed';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { pomXMLContents } from '../../detectors/__MOCKS__/Java/pomXMLContents.mock';
import { buildGRADLEContents } from '../../detectors/__MOCKS__/Java/buildGRADLEContents.mock';

describe('JavaPackageManagementUsedPractice', () => {
  let practice: JavaPackageManagementUsedPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaPackageManagementUsedPractice').to(JavaPackageManagementUsedPractice);
    practice = containerCtx.container.get('JavaPackageManagementUsedPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if there is a pom.xml', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'pom.xml': pomXMLContents,
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing if there is a build.gradle', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'build.gradle': buildGRADLEContents,
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO pom.xml or build.gradle', async () => {
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

  it('Is always applicable', async () => {
    const result = await practice.isApplicable();
    expect(result).toEqual(true);
  });
});
