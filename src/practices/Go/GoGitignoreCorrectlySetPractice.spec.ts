import { GoGitignoreCorrectlySetPractice } from './GoGitignoreCorrectlySetPractice';
import { gitignoreContent } from '../../detectors/__MOCKS__/Go/gitignoreContent.mock';
import { PracticeEvaluationResult } from '../../model';
import {
  TestContainerContext,
  createTestContainer,
} from '../../inversify.config';

const basicGitignore = `
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
vendor/
`;

describe('GoGitignoreCorrectlySetPractice', () => {
  let practice: GoGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container
      .bind('GoGitignoreCorrectlySetPractice')
      .to(GoGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('GoGitignoreCorrectlySetPractice');
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

  it('Returns practicing if the .gitignore is NOT set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
    expect(practice.data.details).not.toBeUndefined();
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({
      ...containerCtx.practiceContext,
      ...{ root: { fileInspector: undefined } },
    });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  describe('Fixer', () => {
    afterEach(async () => {
      containerCtx.virtualFileSystemService.clearFileSystem();
    });

    it('Appends to .gitignore if entry is missing', async () => {
      containerCtx.virtualFileSystemService.setFileSystem({
        '.gitignore':
          '*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\nvendor/\n',
      });

      await practice.evaluate(containerCtx.practiceContext);
      await practice.fix(containerCtx.fixerContext);

      const fixedGitignore = await containerCtx.virtualFileSystemService.readFile(
        '.gitignore',
      );
      expect(fixedGitignore).toBe(
        '*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\nvendor/\n',
      );
    });
  });
});
