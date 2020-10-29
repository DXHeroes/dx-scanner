import { RustGitignoreCorrectlySetPractice } from './RustGitignoreCorrectlySetPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

const invalidGitignore = `
# foo
foo/

bar/*.baz
`;

const basicGitignore = `
# foo
foo/

target/
**/*.rs.bk
`;

describe('RustGitignoreIsCorrectlySetPractice', () => {
  let practice: RustGitignoreCorrectlySetPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('RustGitignoreCorrectlySetPractice').to(RustGitignoreCorrectlySetPractice);
    practice = containerCtx.container.get('RustGitignoreCorrectlySetPractice');
  });

  afterEach(() => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('detects practicing if .gitignore is set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': basicGitignore,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('detects notPracticing if .gitignore is not set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': invalidGitignore,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('detects unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, ...{ root: { fileInspector: undefined } } });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('does not fix correct .gitignore', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': basicGitignore,
    });

    await practice.evaluate(containerCtx.practiceContext);
    await practice.fix(containerCtx.fixerContext);

    const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
    expect(fixedGitignore).toBe(basicGitignore);
  });

  it('appends to .gitignore if entry is missing', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '.gitignore': invalidGitignore,
    });

    await practice.evaluate(containerCtx.practiceContext);
    await practice.fix(containerCtx.fixerContext);

    const fixedGitignore = await containerCtx.virtualFileSystemService.readFile('.gitignore');
    expect(fixedGitignore).toBe(`${invalidGitignore}\n# added by \`dx-scanner --fix\`\ntarget/\n**/*.rs.bk`);
  });
});
