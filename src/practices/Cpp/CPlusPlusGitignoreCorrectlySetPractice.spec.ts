import { CPlusPlusGitignoreCorrectlySetPractice } from './CPlusPlusGitignoreCorrectlySetPractice';
import { gitignoreContent } from '../../detectors/__MOCKS__/Cpp/gitignoreContent.mock';
import { PracticeEvaluationResult } from '../../model';
import {
  TestContainerContext,
  createTestContainer,
} from '../../inversify.config';

const basicGitignore = `*.d
*.slo
*.lo
*.o
*.obj
*.gch
*.pch
*.so
*.dylib
*.dll
*.mod
*.smod
*.lai
*.la
*.a
*.lib
*.exe
*.out
*.app
`;

describe('CPlusPlusGitignoreCorrectlySetPractice', () => {
  let practice: CPlusPlusGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container
      .bind('CPlusPlusGitignoreCorrectlySetPractice')
      .to(CPlusPlusGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('CPlusPlusGitignoreCorrectlySetPractice');
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

  it('Returns notPracticing if the .gitignore is NOT set correctly', async () => {
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
        '.gitignore':'*.d\n*.slo\n*.lo\n*.o\n*.\n*.gch\n*.pch\n*.so\n*.dylib\n*.dll\n*.mod\n*.smod\n*.lai\n*.la\n*.a\n*.lib\n*.exe\n*.out\n*.app\n',
      });

      await practice.evaluate(containerCtx.practiceContext);
      await practice.fix(containerCtx.fixerContext);

      const fixedGitignore = await containerCtx.virtualFileSystemService.readFile(
        '.gitignore',
      );
      expect(fixedGitignore).toBe(
        '*.d\n*.slo\n*.lo\n*.o\n*.\n*.gch\n*.pch\n*.so\n*.dylib\n*.dll\n*.mod\n*.smod\n*.lai\n*.la\n*.a\n*.lib\n*.exe\n*.out\n*.app\n',
      );
    });
  });
});
