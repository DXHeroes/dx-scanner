import { JavaGitignoreCorrectlySetPractice } from './JavaGitignoreCorrectlySetPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { pomXMLContents } from '../../detectors/__MOCKS__/Java/pomXMLContents.mock';
import { buildGRADLEContents } from '../../detectors/__MOCKS__/Java/buildGRADLEContents.mock';
import { gitignoreContent } from '../../detectors/__MOCKS__/Java/gitignoreContent.mock';
import { ErrorCode } from '../../lib/errors';

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

  it('Returns practicing if the .gitignore is set correctly for Kotlin/GRADLE', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': gitignoreContent,
      'build.gradle.kts': buildGRADLEContents,
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

  it('Throw internal error if there is no fileInspector', async () => {
    const thrown = jest.fn();
    try {
      await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    } catch (error) {
      thrown();
      expect(error.code).toEqual(ErrorCode.INTERNAL_ERROR);
    }
    expect(thrown).toBeCalled();
  });

  it('Returns notPracticing if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for build.gradle', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
      'build.gradle': buildGRADLEContents,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns notPracticing if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for build.gradle.kts', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
      'build.gradle.kts': buildGRADLEContents,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns notPracticing if there is *.class, *.log, *.jar, *.war in .gitignore but not correctly set for pom.xml', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': `
      *.class
      *.log
      *.jar
      *.war`,
      'pom.xml': pomXMLContents,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns practicing if there is correctly set .gitignore, but no pom.xml and build.gradle or build.gradle.kts', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': gitignoreContent,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns true if language is Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Java;
    const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
    expect(isApplicable).toBe(true);
  });

  it('Returns true if language is Kotlin', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Kotlin;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Returns false if language is not Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.UNKNOWN;
    const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
    expect(isApplicable).toBe(false);
  });
});
