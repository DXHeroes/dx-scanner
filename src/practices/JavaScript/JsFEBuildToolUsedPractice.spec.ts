import { ProjectComponentPlatform, ProgrammingLanguage } from '../../model';
import { JsFEBuildtoolUsedPractice } from './JsFEBuildToolUsedPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('JsFEBuildtoolUsedPractice', () => {
  let practice: JsFEBuildtoolUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JsFEBuildtoolUsedPractice').to(JsFEBuildtoolUsedPractice);
    practice = containerCtx.container.get('JsFEBuildtoolUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Detects FE Build Tool', async () => {
    packageInspector.hasOneOfPackages = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Did not detect FE Build Tool', async () => {
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
});
