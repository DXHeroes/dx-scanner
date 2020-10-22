import { ReadmeIsCorrectlySet } from './ReadmeCorrectlySetPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

const readmeContent = `
# Readme
## getting starTed
## contribution
### installing
<h2>License
<h3> prerequisites
`;

describe('ReadmeIsCorrectlySet', () => {
  let practice: ReadmeIsCorrectlySet;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ReadmeIsCorrectlySet').to(ReadmeIsCorrectlySet);
    practice = containerCtx.container.get('ReadmeIsCorrectlySet');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns Practicing if readme is set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/readme.md': readmeContent,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there readme is NOT set correctly', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/readme.anything': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, ...{ root: { fileInspector: undefined } } });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is always applicable', async () => {
    const result = await practice.isApplicable();
    expect(result).toEqual(true);
  });

  it('Return notPracticing if there are two h1s', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/readme.md': `${readmeContent}\n# h1 test`,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });
});
