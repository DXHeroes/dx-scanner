import { PracticeEvaluationResult } from '../../model';
import { DependenciesVersionPractice } from './DependenciesVersionPractice';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import ncu from 'npm-check-updates';
import { JavaScriptPackageInspector } from '../../inspectors/package/JavaScriptPackageInspector';
import { mockPackage } from '../../../test/helpers/mockPackage';
jest.mock('npm-check-updates');

describe('DependenciesVersionPractice of Major Level', () => {
  let practice: DependenciesVersionPractice;
  let containerCtx: TestContainerContext;
  const mockedNcu = <jest.Mock>ncu.run;
  const MockedJSPackageInspector = <jest.Mock<JavaScriptPackageInspector>>(<unknown>JavaScriptPackageInspector);
  let mockJsPackageInspector: JavaScriptPackageInspector;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('DependenciesVersionPractice').to(DependenciesVersionPractice);
    practice = containerCtx.container.get('DependenciesVersionPractice');
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
});
