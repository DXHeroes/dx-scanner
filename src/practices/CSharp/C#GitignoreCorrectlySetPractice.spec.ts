import { CSharpGitignoreCorrectlySetPractice } from './C#GitignoreCorrectlySetPractice';
import { gitignoreContent } from '../../detectors/__MOCKS__/CSharp/gitignoreContent.mock';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

const basicGitignore = `
obj/
Cache/
[Bb]in/
*.log
*.user
*.suo
`;

describe('CSharpGitignoreCorrectlySetPractice', () => {
  let practice: CSharpGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('CSharpGitignoreCorrectlySetPractice').to(CSharpGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('CSharpGitignoreCorrectlySetPractice');
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

  it('Returns practicing even with basic gitignore', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': basicGitignore,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  describe('Fixes', () => {
    afterEach(async () => {
      containerCtx.virtualFileSystemService.clearFileSystem();
    });

    it('Does not change correct .gitignore', async () => {
      const gitignore = `${basicGitignore}\npackage-lock.json\n`;
      containerCtx.virtualFileSystemService.setFileSystem({
        '.gitignore': gitignore,
      });

      await practice.evaluate(containerCtx.practiceContext);
      await practice.fix(containerCtx.fixerContext);

      const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
      expect(fixedGitignore).toBe(gitignore);
    });
    it('Appends to .gitignore if entry is missing', async () => {
      containerCtx.virtualFileSystemService.setFileSystem({
        '.gitignore': 'bin/\nobj/\n*.log\n*.user\n',
      });

      await practice.evaluate(containerCtx.practiceContext);
      await practice.fix(containerCtx.fixerContext);

      const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
      expect(fixedGitignore).toBe('bin/\nobj/\n*.log\n*.user\n\n[Cc]ache/\n*.suo\n');
    });
  });
});
