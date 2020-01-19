import { TsGitignoreCorrectlySetPractice } from './TsGitignoreCorrectlySetPractice';
import { gitignoreContent } from '../../detectors/__MOCKS__/JavaScript/gitignoreContent.mock';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

const basicGitignore = `
build
node_modules
coverage
.log
`;

describe('TsGitignoreCorrectlySetPractice', () => {
  let practice: TsGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('TsGitignoreCorrectlySetPractice').to(TsGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('TsGitignoreCorrectlySetPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if the .gitignore is set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': gitignoreContent,
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
    expect(practice.data.details).not.toBeUndefined();
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, ...{ root: { fileInspector: undefined } } });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns notPracticing if there are no lockfiles in .gitignore', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': basicGitignore,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns practicing if there is only one lockfile in .gitignore', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': `${basicGitignore}\nyarn.lock`,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there are both lockfiles in .gitignore', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': `${basicGitignore}\nyarn.lock\npackage-lock.json`,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Is applicable if programming language is TypeScript ', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.TypeScript;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable if programming language is not TypeScript ', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.UNKNOWN;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
