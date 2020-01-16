import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { DependenciesVersionMajorLevelPractice } from './DependenciesVersionMajorLevel';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import ncu from 'npm-check-updates';
import { JavaScriptPackageInspector } from '../../inspectors/package/JavaScriptPackageInspector';
import { mockPackage } from '../../test/helpers/mockPackage';
jest.mock('npm-check-updates');

describe('DependenciesVersionPractice of Major Level', () => {
  let practice: DependenciesVersionMajorLevelPractice;
  let containerCtx: TestContainerContext;
  const mockedNcu = <jest.Mock>ncu.run;
  const MockedJSPackageInspector = <jest.Mock<JavaScriptPackageInspector>>(<unknown>JavaScriptPackageInspector);
  let mockJsPackageInspector: JavaScriptPackageInspector;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DependenciesVersionMajorLevel').to(DependenciesVersionMajorLevelPractice);
    practice = containerCtx.container.get('DependenciesVersionMajorLevel');
    mockJsPackageInspector = new MockedJSPackageInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('not practicing if newer package versions exists of major level', async () => {
    mockedNcu.mockImplementation(() => {
      return { 'ts-node': '^8', typescript: '^3' };
    });
    mockJsPackageInspector.packages = [mockPackage('typescript')];
    containerCtx.practiceContext.packageInspector!.packages = mockJsPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
    expect(practice.data.details).not.toBeUndefined();
  });

  it('practicing if newest package version dependency of major level', async () => {
    mockedNcu.mockImplementation(() => {
      return {};
    });
    mockJsPackageInspector.packages = [mockPackage('typescript')];
    containerCtx.practiceContext.packageInspector!.packages = mockJsPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns true if language is a JavaScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.JavaScript;
    const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
    expect(isApplicable).toBe(true);
  });

  it('Returns false if language is not a JavaScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.UNKNOWN;
    const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
    expect(isApplicable).toBe(false);
  });

  it('Returns unknown if there is no packageInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });
});
