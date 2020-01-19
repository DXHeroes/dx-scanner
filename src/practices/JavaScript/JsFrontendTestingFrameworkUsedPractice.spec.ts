import { ProjectComponentPlatform, ProgrammingLanguage } from '../../model';
import { JsFrontendTestingFrameworkUsedPractice } from './JsFrontendTestingFrameworkUsedPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('JsFrontendTestingFrameworkUsedPractice', () => {
  let practice: JsFrontendTestingFrameworkUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JsFrontendTestingFrameworkUsedPractice').to(JsFrontendTestingFrameworkUsedPractice);
    practice = containerCtx.container.get('JsFrontendTestingFrameworkUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Detects FE testing framework', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Detects FE testing framework', async () => {
    packageInspector.hasOneOfPackages = () => false;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Did not recognize packageInspector', async () => {
    const result = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(result).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is TypeScript or Javascript but not frontend', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.JavaScript;
    containerCtx.practiceContext.projectComponent.platform = ProjectComponentPlatform.UNKNOWN;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });

  it('Is applicable if it is JavaScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.JavaScript;
    containerCtx.practiceContext.projectComponent.platform = ProjectComponentPlatform.FrontEnd;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable if it is TypeScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.TypeScript;
    containerCtx.practiceContext.projectComponent.platform = ProjectComponentPlatform.FrontEnd;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });
});
