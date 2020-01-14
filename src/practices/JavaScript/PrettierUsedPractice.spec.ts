import { PrettierUsedPractice } from './PrettierUsedPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('PrettierUsedPractice', () => {
  let practice: PrettierUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('PrettierUsedPractice').to(PrettierUsedPractice);
    practice = containerCtx.container.get('PrettierUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Detects Prettier', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Did not detect Prettier', async () => {
    packageInspector.hasOneOfPackages = () => false;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Did not recognize packageInspector', async () => {
    const result = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(result).toEqual(PracticeEvaluationResult.unknown);
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
