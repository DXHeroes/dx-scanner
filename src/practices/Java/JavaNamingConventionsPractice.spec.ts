import { JavaNamingConventionsPractice } from './JavaNamingConventionsPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('JavaPackageManagementUsedPractice', () => {
  let practice: JavaNamingConventionsPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaNamingConventionsPractice').to(JavaNamingConventionsPractice);
    practice = containerCtx.container.get('JavaNamingConventionsPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if Java class files are using correct naming conventions', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'CorrectNamingConvention.java': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing if Kotlin class files are using correct naming conventions', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'CorrectNamingConvention.kt': '',
      'CorrectNamingConventionTwo.kts': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns NOT practicing if Java class files are using incorrect naming conventions', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'incorrect_snake_case_naming_convention.java': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns NOT practicing if Kotlin class files are using incorrect naming conventions', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'incorrect_snake_case_naming_convention.kt': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns NOT practicing if Java class files are not capitalized', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'incorrectNamingConvention.java': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns NOT practicing if Kotlin class files are not capitalized', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'incorrectNamingConvention.kt': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns practicing on deep Java class files are using correct naming conventions', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'CorrectNamingConvention.java': '',
      'src/main/java/org/vision/root/CronOperations/PreciselyCorrectNamingConvention.java': '',
      'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.java': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing on deep Kotlin class files are using correct naming conventions', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'CorrectNamingConvention.kt': '',
      'src/main/java/org/vision/root/CronOperations/PreciselyCorrectNamingConvention.kt': '',
      'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.kt': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns NOT practicing on deep Kotlin class files are using incorrect naming conventions', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'CorrectNamingConvention.kt': '',
      'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.kt': '',
      'src/main/java/org/vision/root/CronOperations/incorrectNamingConvention.kt': '',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there are no .java or .kt files', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'pom.xml': '...',
      'build.gradle': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Does not evaluate & skips build.gradle.kts file to check other class files', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'pom.xml': '...',
      'build.gradle.kts': '...',
      'src/main/java/org/vision/root/CronOperations/VeryCorrectNamingConvention.kt': '',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable to Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Java;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable to Kotlin', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Kotlin;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable to other languages', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Swift;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
