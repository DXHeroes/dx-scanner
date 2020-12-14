import { PythonLinterUsedPractice } from './PythonLinterUsedPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('PythonLinterUsedPractice', () => {
  let practice: PythonLinterUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('PythonLinterUsedPractice').to(PythonLinterUsedPractice);
    practice = containerCtx.container.get('PythonLinterUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Detects a Python linter dependency', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Did not detect a Python linter dependency', async () => {
    packageInspector.hasOneOfPackages = () => false;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Did not recognize packageInspector', async () => {
    const result = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(result).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable if it is Python', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Python;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable if it is not Python', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Haskell;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
