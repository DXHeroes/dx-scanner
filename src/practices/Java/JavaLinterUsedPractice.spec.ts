import { JavaLinterUsedPractice } from './JavaLinterUsedPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('JavaLinterUsedPractice', () => {
  let practice: JavaLinterUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaLinterUsedPractice').to(JavaLinterUsedPractice);
    practice = containerCtx.container.get('JavaLinterUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Detects a Java linter dependency', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Did not detect a Java linter dependency', async () => {
    packageInspector.hasOneOfPackages = () => false;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Did not recognize packageInspector', async () => {
    const result = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(result).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable if it is Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Java;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable if it is Kotlin', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Kotlin;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable if it is not Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Haskell;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
