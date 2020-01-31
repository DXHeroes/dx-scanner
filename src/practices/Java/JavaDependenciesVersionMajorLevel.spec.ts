import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { JavaDependenciesVersionMajorLevel } from './JavaDependenciesVersionMajorLevel';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { mockPackage } from '../../test/helpers/mockPackage';
import { JavaPackageInspector } from '../../inspectors';
import * as axios from 'axios';
jest.mock('axios');

describe('JavaDependenciesVersionPractice of Major Level', () => {
  let practice: JavaDependenciesVersionMajorLevel;
  let containerCtx: TestContainerContext;
  const MockedJavaPackageInspector = <jest.Mock<JavaPackageInspector>>(<unknown>JavaPackageInspector);
  let mockJavaPackageInspector: JavaPackageInspector;
  const mockedAxios = <jest.Mock>axios.default.get;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaDependenciesVersionMajorLevel').to(JavaDependenciesVersionMajorLevel);
    practice = containerCtx.container.get('JavaDependenciesVersionMajorLevel');
    mockJavaPackageInspector = new MockedJavaPackageInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('not practicing if newer dependency versions of major level exists', async () => {
    mockedAxios.mockResolvedValueOnce({ data: { response: { docs: [{ latestVersion: '2.2.1.RELEASE' }] } } });
    mockJavaPackageInspector.packages = [mockPackage('org.springframework.boot:spring-boot-starter-actuator')];
    containerCtx.practiceContext.packageInspector!.packages = mockJavaPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('practicing if newest dependency version of major level does not exist', async () => {
    mockedAxios.mockResolvedValueOnce({ data: { response: { docs: [{ latestVersion: '' }] } } });

    mockJavaPackageInspector.packages = [mockPackage('org.springframework.boot:spring-boot-starter-actuator')];
    containerCtx.practiceContext.packageInspector!.packages = mockJavaPackageInspector.packages;

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Is applicable if it is Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Java;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable if it is Kotlin', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Kotlin;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is NOT applicable if it is not Java or Kotlin', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Python;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
