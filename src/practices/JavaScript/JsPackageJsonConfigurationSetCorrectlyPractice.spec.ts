import { JsPackageJsonConfigurationSetCorrectlyPractice } from './JsPackageJsonConfigurationSetCorrectlyPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('JsPackageJsonConfigurationSetCorrectlyPractice', () => {
  let practice: JsPackageJsonConfigurationSetCorrectlyPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JsPackageJsonConfigurationSetCorrectlyPractice').to(JsPackageJsonConfigurationSetCorrectlyPractice);
    practice = containerCtx.container.get('JsPackageJsonConfigurationSetCorrectlyPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if scripts build, start, test, lint are used', async () => {
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if tscripts build, start, test, lint are NOT used', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/package.json': `{ "scripts": {
              "no": "script"
            }
        }`,
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
    expect(practice.data.details).not.toBeUndefined();
  });

  it('Returns unknown if there are no file inspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable if it is JavaScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.JavaScript;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable if it is TypeScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.TypeScript;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable if it is not TypeScript nor JavaScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.UNKNOWN;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
