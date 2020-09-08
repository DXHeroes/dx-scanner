import { ESLint } from 'eslint';
import { DirectoryJSON } from 'memfs/lib/volume';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { ESLintWithoutErrorsPractice } from './ESLintWithoutErrorsPractice';
import * as fs from 'fs';
import path from 'path';
import { eslintrRcJson } from './__MOCKS__/eslintRcMockJson';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { getEsLintReport } from './__MOCKS__/eslintReport';
import { PackageManagerUtils, PackageManagerType } from '../utils/PackageManagerUtils';
jest.mock('eslint');

describe('ESLintWithoutErrorsPractice', () => {
  let practice: ESLintWithoutErrorsPractice;
  let containerCtx: TestContainerContext;

  const mockedEslint = <jest.Mock>(<unknown>ESLint);

  beforeEach(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
    practice = containerCtx.container.get('ESLintWithoutErrorsPractice');
    jest.spyOn(PackageManagerUtils, 'getPackageManagerInstalled').mockImplementation(async () => PackageManagerType.npm);
  });

  afterEach(() => {
    containerCtx.practiceContext.fileInspector!.purgeCache();
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

  it('Returns undefined if ctx file inspector is undefined', async () => {
    practice = containerCtx.container.get('ESLintWithoutErrorsPractice');
    const result = await practice.evaluate(<PracticeContext>{ fileInspector: undefined });
    expect(result).toEqual(PracticeEvaluationResult.unknown);
  });

  it('Returns practicing, if errorCount === 0', async () => {
    const report = getEsLintReport();
    mockedEslint.mockImplementation(() => {
      return {
        lintFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toEqual([]);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns not practicing, if errorCount !== 0, creates correct linter issue dtos if there are errors', async () => {
    const report = getEsLintReport([
      {
        filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
        messages: [{ line: 1, column: 37, ruleId: '', message: 'Strings must use doublequote.', severity: <0 | 1 | 2>2 }],
        errorCount: 1,
        warningCount: 0,
        fixableErrorCount: 1,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ]);

    mockedEslint.mockImplementation(() => {
      return {
        lintFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toBeDefined();
    expect(practice.data.statistics?.linterIssues![0]).toEqual({
      filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts(1)(37)',
      severity: 'error',
      type: 'Strings must use doublequote.',
      url: '/Users/jakubvacek/dx-scanner/src/commands/init.ts#L1',
    });
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Correctly read .eslintrc.json file', async () => {
    const report = getEsLintReport();
    const mockFileSystem: DirectoryJSON = {
      '/.eslintrc.json': JSON.stringify(eslintrRcJson),
    };
    containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);

    mockedEslint.mockImplementation(() => {
      return {
        lintFiles: () => report,
      };
    });

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Correctly read correct .eslintrc.yml file', async () => {
    const report = getEsLintReport();
    const p = path.join(__dirname, '__MOCKS__/eslintRcMock.yml');

    const mockFileSystem: DirectoryJSON = {
      '/.eslintrc.yml': fs.readFileSync(p, 'utf8'),
    };
    containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);

    mockedEslint.mockImplementation(() => {
      return {
        lintFiles: () => report,
      };
    });

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Throw error if it is not correct yaml file', async () => {
    const report = getEsLintReport();

    const mockFileSystem: DirectoryJSON = {
      '/.eslintrc.yml': `badYaml: true
      env:
        es6:`,
    };
    containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);

    mockedEslint.mockImplementation(() => {
      return {
        lintFiles: () => report,
      };
    });
    try {
      await practice.evaluate(containerCtx.practiceContext);
      fail('It failed');
    } catch (error) {
      expect(error.name).toEqual('YAMLException');
    }
  });
});
