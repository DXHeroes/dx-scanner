import { mockPackage } from '../../test/helpers/mockPackage';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { JavaDependenciesVersionMinorPatchLevel } from './JavaDependenciesVersionMinorPatchLevel';
import { JavaPackageInspector } from '../../inspectors';
import * as axios from 'axios';
jest.mock('axios');

describe('JavaDependenciesVersionPractice of Minor and Patch Level', () => {
  let practice: JavaDependenciesVersionMinorPatchLevel;
  let containerCtx: TestContainerContext;
  const MockedJavaPackageInspector = <jest.Mock<JavaPackageInspector>>(<unknown>JavaPackageInspector);
  let mockJavaPackageInspector: JavaPackageInspector;
  const mockedAxios = <jest.Mock>axios.default.get;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaDependenciesVersionMinorPatchLevel').to(JavaDependenciesVersionMinorPatchLevel);
    practice = containerCtx.container.get('JavaDependenciesVersionMinorPatchLevel');
    mockJavaPackageInspector = new MockedJavaPackageInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('not practicing if newer dependency versions of minor or patch level exists', async () => {
    mockedAxios.mockResolvedValueOnce({ data: { response: { docs: [{ latestVersion: '2.2.1.RELEASE' }] } } });

    mockJavaPackageInspector.packages = [mockPackage('org.springframework.boot:spring-boot-starter-actuator')];
    containerCtx.practiceContext.packageInspector!.packages = mockJavaPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('practicing if newest dependency version dependency of minor or patch level does not exist', async () => {
    mockedAxios.mockResolvedValueOnce({ data: { response: { docs: [{ latestVersion: '' }] } } });

    mockJavaPackageInspector.packages = [mockPackage('org.springframework.boot:spring-boot-starter-actuator')];
    containerCtx.practiceContext.packageInspector!.packages = mockJavaPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });
});
