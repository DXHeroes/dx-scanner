import { JsLockfileIsPresentPractice } from './JsLockfileIsPresentPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import shelljs from 'shelljs';
import { sync as commandExists } from 'command-exists';

jest.mock('shelljs', () => ({
  pwd: jest.fn(),
  cd: jest.fn(),
  exec: jest.fn(),
}));

jest.mock('command-exists', () => ({
  sync: jest.fn(),
}));

describe('LockfileIsPresentPractice', () => {
  let containerCtx: TestContainerContext;
  let practice: JsLockfileIsPresentPractice;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('LockfileIsPresentPractice').to(JsLockfileIsPresentPractice);
    practice = containerCtx.container.get('LockfileIsPresentPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing if there is a package-lock.json', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/package-lock.json': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns practicing if there is a yarn.lock', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/yarn.lock': '...',
    });
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if there is NO lock file', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      '/not.exists': '...',
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there is no fileInspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Is applicable to JS', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.JavaScript;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is applicable to TS', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.TypeScript;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(true);
  });

  it('Is not applicable to other languages', async () => {
    containerCtx.practiceContext.projectComponent.language = ProgrammingLanguage.Python;
    const result = await practice.isApplicable(containerCtx.practiceContext);
    expect(result).toEqual(false);
  });

  describe('fixer', () => {
    let npmInstallRun: boolean;
    let yarnInstallRun: boolean;

    beforeAll(() => {
      (shelljs.exec as jest.Mock).mockImplementation((cmd: string) => {
        if (cmd.startsWith('npm i')) npmInstallRun = true;
        else if (cmd.startsWith('yarn install')) yarnInstallRun = true;
      });
      containerCtx.virtualFileSystemService.setFileSystem({
        'package.json': '',
      });
    });

    beforeEach(() => {
      npmInstallRun = false;
      yarnInstallRun = false;
    });

    it('runs npm install when npm installed', async () => {
      (commandExists as jest.Mock).mockImplementation((cmd: string) => cmd === 'npm');

      await practice.fix();

      expect(npmInstallRun).toBe(true);
      expect(yarnInstallRun).toBe(false);
    });

    it('runs yarn install when yarn installed', async () => {
      (commandExists as jest.Mock).mockImplementation((cmd: string) => cmd === 'yarn');

      await practice.fix();

      expect(npmInstallRun).toBe(false);
      expect(yarnInstallRun).toBe(true);
    });
  });
});
