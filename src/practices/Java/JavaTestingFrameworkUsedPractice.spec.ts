import { JavaTestingFrameworkUsedPractice } from './JavaTestingFrameworkUsedPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('JavaTestingFrameworkUsedPractice', () => {
  let practice: JavaTestingFrameworkUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaTestingFrameworkUsedPractice').to(JavaTestingFrameworkUsedPractice);
    practice = containerCtx.container.get('JavaTestingFrameworkUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Detects Java Testing framework', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Did not detect Java Testing framework', async () => {
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

  it('Is applicable if it is not Java', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Python;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
