import { ESLintUsedPractice } from './ESLintUsedPractice';
import { ProgrammingLanguage } from '../../model';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('ESLintUsedPractice', () => {
  let practice: ESLintUsedPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ESLintUsedPractice').to(ESLintUsedPractice);
    practice = containerCtx.container.get('ESLintUsedPractice');
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
  });

  it('Returns true if lang is a JavaScript or TypeScript', async () => {
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Returns false if lang is NOT a JavaScript or TypeScript', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.UNKNOWN;

    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });

  it('Detects ESLint', async () => {
    packageInspector.hasPackage = () => true;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Did not detect ESLint', async () => {
    packageInspector.hasPackage = () => false;

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Did not detect ESLint and did not recognize packageInspector', async () => {
    const result = await practice.evaluate({ ...containerCtx.practiceContext, packageInspector: undefined });
    expect(result).toEqual(PracticeEvaluationResult.unknown);
  });
});
