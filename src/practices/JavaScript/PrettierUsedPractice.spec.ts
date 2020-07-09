import shelljs from 'shelljs';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { PrettierUsedPractice } from './PrettierUsedPractice';

jest.mock('shelljs', () => ({
  exec: jest.fn(),
}));

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

  describe('Fixer', () => {
    afterEach(async () => {
      jest.clearAllMocks();
      containerCtx.virtualFileSystemService.clearFileSystem();
    });

    it('Install prettier package', async () => {
      containerCtx.virtualFileSystemService.setFileSystem({
        'package.json': '{}',
        'package-lock.json': '',
      });

      (shelljs.exec as jest.Mock).mockImplementation();
      await practice.fix(containerCtx.fixerContext);

      expect((shelljs.exec as jest.Mock).mock.calls[0][0]).toContain('prettier');
    });
    it('Creates prettier config file', async () => {
      containerCtx.virtualFileSystemService.setFileSystem({
        'package.json': '{}',
        'package-lock.json': '',
      });

      await practice.fix(containerCtx.fixerContext);

      const exists = await containerCtx.virtualFileSystemService.exists('.prettierrc');
      expect(exists).toBe(true);
    });
    it('Add prettier script', async () => {
      containerCtx.virtualFileSystemService.setFileSystem({
        'package.json': '{}',
        'package-lock.json': '',
      });

      await practice.fix(containerCtx.fixerContext);

      const newPackageJson = await containerCtx.virtualFileSystemService.readFile('package.json');
      expect(newPackageJson).toContain('format');
    });
  });
});
