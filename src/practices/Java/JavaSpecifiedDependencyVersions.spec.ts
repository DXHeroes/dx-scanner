import { JavaSpecifiedDependencyVersions } from './JavaSpecifiedDependencyVersions';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { JavaPackageInspector } from '../../inspectors';
import { mockPackage } from '../../test/helpers/mockPackage';

describe('JavaSpecifiedDependencyVersions', () => {
  let practice: JavaSpecifiedDependencyVersions;
  let containerCtx: TestContainerContext;
  const MockedJavaPackageInspector = <jest.Mock<JavaPackageInspector>>(<unknown>JavaPackageInspector);
  let mockJavaPackageInspector: JavaPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaSpecifiedDependencyVersions').to(JavaSpecifiedDependencyVersions);
    practice = containerCtx.container.get('JavaSpecifiedDependencyVersions');
    mockJavaPackageInspector = new MockedJavaPackageInspector();
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
    containerCtx.practiceContext.packageInspector!.packages = [];
  });

  it('Returns practicing if there are specified versions', async () => {
    mockJavaPackageInspector.packages = [mockPackage('org.springframework.boot:spring-boot-starter-actuator', '2.1.8')];
    containerCtx.practiceContext.packageInspector!.packages = mockJavaPackageInspector.packages;
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns NOT practicing if not all versions are specified', async () => {
    mockJavaPackageInspector.packages = [mockPackage('org.springframework.boot:spring-boot-starter-actuator', '')];
    containerCtx.practiceContext.packageInspector!.packages = mockJavaPackageInspector.packages;
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there are NO packages', async () => {
    mockJavaPackageInspector.packages = undefined;
    containerCtx.practiceContext.packageInspector!.packages = mockJavaPackageInspector.packages;
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns unknown if there is no packageInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable to Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Java;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable if it is Kotlin', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Kotlin;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable to other languages', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Python;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
