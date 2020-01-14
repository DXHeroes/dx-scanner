import { JavaGitignoreCorrectlySetPractice } from './JavaGitignoreCorrectlySetPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { pomXMLContents } from '../../detectors/__MOCKS__/Java/pomXMLContents.mock';
import { buildGRADLEContents } from '../../detectors/__MOCKS__/Java/buildGRADLEContents.mock';
import { gitignoreContent } from '../../detectors/__MOCKS__/Java/gitignoreContent.mock';

describe('JavaGitignoreCorrectlySetPractice', () => {
  let practice: JavaGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaGitignoreCorrectlySetPractice').to(JavaGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('JavaGitignoreCorrectlySetPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if the .gitignore is set correctly for MAVEN', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': gitignoreContent,
      'pom.xml': pomXMLContents,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing if the .gitignore is set correctly for GRADLE', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': gitignoreContent,
      'build.gradle': buildGRADLEContents,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there the .gitignore is NOT set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns unknown if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for build.gradle', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
      'build.gradle': buildGRADLEContents,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns unknown if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for build.gradle', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
      'pom.xml': pomXMLContents,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns unknown if there is correctly set .gitignore, but no pom.xml and build.gradle ', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': gitignoreContent,
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns true if language is a Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Java;
    const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
    expect(isApplicable).toBe(true);
  });

  it('Returns false if language is not a Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.UNKNOWN;
    const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
    expect(isApplicable).toBe(false);
  });
});
