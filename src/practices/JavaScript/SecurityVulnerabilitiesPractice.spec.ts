import { SecurityVulnerabilitiesPractice } from './SecurityVulnerabilitiesPractice';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import shelljs from 'shelljs';
import { sync as commandExists } from 'command-exists';
import { forEach } from 'lodash';
import { parseNpmAudit, parseYarnAudit } from '../PracticeUtils';
jest.mock('../PracticeUtils');

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
  const setupMocks = (mockOverrides: { f: any; impl: (...args: any) => any }[] = [], code = 0) => {
    (commandExists as jest.Mock).mockImplementation(() => true);

    forEach(mockOverrides, (value) => {
      (value.f as jest.Mock).mockImplementation(value.impl);
    });
    (parseNpmAudit as jest.Mock).mockReturnValue({
      vulnerabilities: [
        {
          library: 'yargs-parser',
          type: 'Prototype Pollution',
          severity: 'low',
          vulnerable_versions: '<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2',
          patchedIn: '>=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2',
          dependencyOf: '@commitlint/lint',
          path: '@commitlint/lint > @commitlint/parse > conventional-commits-parser > meow > yargs-parser',
        },
      ],
      summary: { info: 0, low: 32, moderate: 0, high: 0, critical: 0, code },
    });
    (parseYarnAudit as jest.Mock).mockReturnValue({
      vulnerabilities: [
        {
          library: 'yargs-parser',
          type: 'Prototype Pollution',
          severity: 'low',
          vulnerable_versions: '<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2',
          patchedIn: '>=13.1.2 <14.0.0 || >=15.0.1 <16.0.0 || >=18.1.2',
          dependencyOf: '@commitlint/lint',
          path: '@commitlint/lint > @commitlint/parse > conventional-commits-parser > meow > yargs-parser',
        },
      ],
      summary: { info: 0, low: 32, moderate: 0, high: 0, critical: 0, code },
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
    setupMocks([], 1);
    containerCtx.virtualFileSystemService.setFileSystem({
      'package-lock.json': '',
    });
    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.notPracticing);
  });

  it('Returns notPracticing if vulnerability found through yarn', async () => {
    setupMocks([], 16);

    containerCtx.virtualFileSystemService.setFileSystem({
      'yarn.lock': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.notPracticing);
  });

  it('Returns practicing if low-severity vulnerability found through yarn', async () => {
    setupMocks([], 6);

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
    (shelljs.exec as jest.Mock).mockReturnValue({
      error: { code: 'ELOCKVERIFY', summary: 'Errors were found in your package-lock.json', detail: '' },
    });
    containerCtx.virtualFileSystemService.setFileSystem({
      'package-lock.json': '',
    });

    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toBe(PracticeEvaluationResult.unknown);
  });
});
