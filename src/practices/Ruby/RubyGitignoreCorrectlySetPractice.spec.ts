import { RubyGitignoreCorrectlySetPractice } from './RubyGitignoreCorrectlySetPractice';
import { gitignoreContent } from '../../detectors/__MOCKS__/Ruby/gitignoreContent.mock';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

const basicGitignore = `
*.gem
*.rbc
/coverage/
/tmp/
/.config
`;

describe('RubyGitignoreCorrectlySetPractice', () => {
  let practice: RubyGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('RubyGitignoreCorrectlySetPractice').to(RubyGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('RubyGitignoreCorrectlySetPractice');
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
      const gitignore = basicGitignore;
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
        '.gitignore': '*.gem\n/coverage/\n',
      });

      await practice.evaluate(containerCtx.practiceContext);
      await practice.fix(containerCtx.fixerContext);

      const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
      expect(fixedGitignore).toBe('*.gem\n/coverage/\n\n# added by `dx-scanner --fix`\n/tmp/\n/.config\n*.rbc\n');
    });
  });
});
