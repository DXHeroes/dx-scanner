import { JavaCodeStyleUsedPractice } from './JavaCodeStyleUsedPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { pomXMLContents } from '../../detectors/__MOCKS__/Java/pomXMLContents.mock';
import { buildGRADLEContents } from '../../detectors/__MOCKS__/Java/buildGRADLEContents.mock';
import { codeStyleXML } from '../../detectors/__MOCKS__/Java/styleXMLContents.mock';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('JavaCodeStyleUsedPractice', () => {
  let practice: JavaCodeStyleUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaCodeStyleUsedPractice').to(JavaCodeStyleUsedPractice);
    practice = containerCtx.container.get('JavaCodeStyleUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if there is a Google Code Style *.xml configuration file', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'intellij-java-google-style.xml': codeStyleXML,
      'pom.xml': pomXMLContents,
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing if there is a package for code styles', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is no package or xml file', async () => {
    packageInspector.hasOneOfPackages = () => false;
    containerCtx.virtualFileSystemService.setFileSystem({
      'build.gradle.kts': buildGRADLEContents,
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns unknown if there is no packageInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable only to Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Java;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable to other languages', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Ruby;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
