import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { CSharpLinterUsedPractice } from './CsharpLinterUsedPractice';

describe('CSharpLinterUsedPractice', () => {
  let practice: CSharpLinterUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('CSharpLinterUsedPractice').to(CSharpLinterUsedPractice);
    practice = containerCtx.container.get('CSharpLinterUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Detects a C# linter dependency', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Did not detect a C# linter dependency', async () => {
    packageInspector.hasOneOfPackages = () => false;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Did not recognize packageInspector', async () => {
    const result = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(result).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable if it is C#', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.CSharp;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable if it is not C#', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.TypeScript;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });
});
