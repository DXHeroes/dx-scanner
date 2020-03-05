import { SecurityVulnerabilitiesPractice } from './SecurityVulnerabilitiesPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import shelljs from 'shelljs';
import { sync as commandExists } from 'command-exists';
import { forEach } from 'lodash';

jest.mock('shelljs', () => ({
  pwd: jest.fn(),
  cd: jest.fn(),
  exec: jest.fn(),
}));

jest.mock('command-exists', () => ({
  sync: jest.fn(),
}));

describe('SecurityVulnerabilitiesPractice', () => {
  let practice: SecurityVulnerabilitiesPractice;
  let containerCtx: TestContainerContext;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupMocks = (mockOverrides: { f: any; impl: (...args: any) => any }[] = []) => {
    (shelljs.exec as jest.Mock).mockImplementation(() => {
      const result = new String('{"actions":[], "data":{ "vulnerabilities": {}}}'); // minimal data for both npm and yarn
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any).code = 0;
      return result;
    });
    (commandExists as jest.Mock).mockImplementation(() => true);

    forEach(mockOverrides, (value) => {
      (value.f as jest.Mock).mockImplementation(value.impl);
    });
  };

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('SecurityVulnerabilitiesPractice').to(SecurityVulnerabilitiesPractice);
    practice = containerCtx.container.get('SecurityVulnerabilitiesPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
    containerCtx.practiceContext.fileInspector!.purgeCache();
    jest.clearAllMocks();
  });

  it('Returns unknown when no files present', async () => {
    setupMocks();
    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.unknown);
  });

  it('Runs npm when package-lock present', async () => {
    setupMocks();
    containerCtx.virtualFileSystemService.setFileSystem({
      'package-lock.json': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.practicing);
    expect((shelljs.exec as jest.Mock).mock.calls[0][0]).toContain('npm'); // 1st argument of 1st call
  });

  it('Runs npm when npm shrinkwrap present', async () => {
    setupMocks();
    containerCtx.virtualFileSystemService.setFileSystem({
      'npm-shrinkwrap.json': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.practicing);
    expect((shelljs.exec as jest.Mock).mock.calls[0][0]).toContain('npm');
  });

  it('Runs yarn when yarn lock present', async () => {
    setupMocks();
    containerCtx.virtualFileSystemService.setFileSystem({
      'yarn.lock': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.practicing);
    expect((shelljs.exec as jest.Mock).mock.calls[0][0]).toContain('yarn');
  });

  it('Fallback to npm when yarn not installed', async () => {
    setupMocks();
    (commandExists as jest.Mock).mockImplementation((cmd: string) => cmd !== 'yarn');
    containerCtx.virtualFileSystemService.setFileSystem({
      'yarn.lock': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.practicing);
    expect((shelljs.exec as jest.Mock).mock.calls[0][0]).toContain('npm');
  });

  it('Returns unknown when yarn and npm not installed', async () => {
    setupMocks([{ f: commandExists, impl: () => false }]);
    containerCtx.virtualFileSystemService.setFileSystem({
      'yarn.lock': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.unknown);
  });

  it('Returns notPracticing if vulnerability found through npm', async () => {
    setupMocks([
      {
        f: shelljs.exec,
        impl: () => {
          const result = new String('{"actions":[]}');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any).code = 1;
          return result;
        },
      },
    ]);
    containerCtx.virtualFileSystemService.setFileSystem({
      'package-lock.json': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.notPracticing);
  });

  it('Returns notPracticing if vulnerability found through yarn', async () => {
    setupMocks([
      {
        f: shelljs.exec,
        impl: () => {
          const result = new String('{"data":{"vulnerabilities":{}}}');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any).code = 16;
          return result;
        },
      },
    ]);
    containerCtx.virtualFileSystemService.setFileSystem({
      'yarn.lock': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.notPracticing);
  });

  it('Returns practicing if low-severity vulnerability found through yarn', async () => {
    setupMocks([
      {
        f: shelljs.exec,
        impl: () => {
          const result = new String('{"data":{"vulnerabilities":{}}}');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any).code = 6;
          return result;
        },
      },
    ]);
    containerCtx.virtualFileSystemService.setFileSystem({
      'yarn.lock': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.practicing);
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

  it('Returns unknown when yarn and npm not installed', async () => {
    setupMocks([{ f: commandExists, impl: () => false }]);
    containerCtx.virtualFileSystemService.setFileSystem({
      'yarn.lock': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.unknown);
  });

  it('Returns unknown when npm audit errors', async () => {
    setupMocks([
      {
        f: shelljs.exec,
        impl: () => {
          const result = new String(
            '{"error": {"code": "ELOCKVERIFY","summary": "Errors were found in your package-lock.json","detail": ""}}',
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result as any).code = 1;
          return result;
        },
      },
    ]);
    containerCtx.virtualFileSystemService.setFileSystem({
      'package-lock.json': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.unknown);
  });
});
