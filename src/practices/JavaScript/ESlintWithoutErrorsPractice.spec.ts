import { CLIEngine } from 'eslint';
import { DirectoryJSON } from 'memfs/lib/volume';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { ESLintWithoutErrorsPractice } from './ESLintWithoutErrorsPractice';
import * as fs from 'fs';
import path from 'path';
import { eslintrRcJson } from './__MOCKS__/eslintRcMockJson';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
jest.mock('eslint');

describe('ESLintWithoutErrorsPractice', () => {
  let practice: ESLintWithoutErrorsPractice;
  let containerCtx: TestContainerContext;

  const mockedEslint = <jest.Mock>(<unknown>CLIEngine);

  beforeEach(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
    practice = containerCtx.container.get('ESLintWithoutErrorsPractice');
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
    const report = {
      errorCount: 0,
      results: [
        {
          filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
          messages: [],
          errorCount: 0,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
        },
      ],
    };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toEqual([]);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns not practicing, if errorCount !== 0, creates correct linter issue dtos if there are errors, local repository', async () => {
    const report = {
      errorCount: 1,
      results: [
        {
          filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
          messages: [
            {
              ruleId: 'quotes',
              severity: 2,
              message: 'Strings must use doublequote.',
              line: 1,
              column: 37,
              nodeType: 'Literal',
              messageId: 'wrongQuotes',
              endLine: 1,
              endColumn: 58,
              fix: [Object],
            },
          ],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 1,
          fixableWarningCount: 0,
          source: '',
        },
      ],
    };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toBeDefined();
    expect(practice.data.statistics?.linterIssues![0]).toEqual({
      filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts(1)(37)',
      severity: 'error',
      type: 'Strings must use doublequote.',
      url: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
    });
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns not practicing, if errorCount !== 0, creates correct linter issue dtos if there are errors, gitHub repository', async () => {
    const report = {
      errorCount: 1,
      results: [
        {
          filePath: '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58/src/commands/init.ts',
          messages: [
            {
              ruleId: 'quotes',
              severity: 2,
              message: 'Strings must use doublequote.',
              line: 1,
              column: 37,
              nodeType: 'Literal',
              messageId: 'wrongQuotes',
              endLine: 1,
              endColumn: 58,
              fix: [Object],
            },
          ],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 1,
          fixableWarningCount: 0,
          source: '',
        },
      ],
    };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    containerCtx.practiceContext.projectComponent.path = '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58';
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://github.com/DXHeroes/dx-scanner';
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toBeDefined();
    expect(practice.data.statistics?.linterIssues![0]).toEqual({
      filePath: '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58/src/commands/init.ts(1)(37)',
      severity: 'error',
      type: 'Strings must use doublequote.',
      url: 'https://github.com/DXHeroes/dx-scanner/tree/master/src/commands/init.ts',
    });
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns not practicing, if errorCount !== 0, creates correct linter issue dtos if there are errors, gitLab repository', async () => {
    const report = {
      errorCount: 1,
      results: [
        {
          filePath: '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58/src/commands/init.ts',
          messages: [
            {
              ruleId: 'quotes',
              severity: 2,
              message: 'Strings must use doublequote.',
              line: 1,
              column: 37,
              nodeType: 'Literal',
              messageId: 'wrongQuotes',
              endLine: 1,
              endColumn: 58,
              fix: [Object],
            },
          ],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 1,
          fixableWarningCount: 0,
          source: '',
        },
      ],
    };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    containerCtx.practiceContext.projectComponent.path = '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58';
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://gitlab.com/DXHeroes/dx-scanner';
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toBeDefined();
    expect(practice.data.statistics?.linterIssues![0]).toEqual({
      filePath: '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58/src/commands/init.ts(1)(37)',
      severity: 'error',
      type: 'Strings must use doublequote.',
      url: 'https://gitlab.com/DXHeroes/dx-scanner/tree/master/src/commands/init.ts',
    });
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns not practicing, if errorCount !== 0, creates correct linter issue dtos if there are errors, bitBucket repository', async () => {
    const report = {
      errorCount: 1,
      results: [
        {
          filePath: '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58/src/commands/init.ts',
          messages: [
            {
              ruleId: 'quotes',
              severity: 2,
              message: 'Strings must use doublequote.',
              line: 1,
              column: 37,
              nodeType: 'Literal',
              messageId: 'wrongQuotes',
              endLine: 1,
              endColumn: 58,
              fix: [Object],
            },
          ],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 1,
          fixableWarningCount: 0,
          source: '',
        },
      ],
    };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    containerCtx.practiceContext.projectComponent.path = '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58';
    containerCtx.practiceContext.projectComponent.repositoryPath = 'https://bitbucket.org/DXHeroes/dx-scanner';
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toBeDefined();
    expect(practice.data.statistics?.linterIssues![0]).toEqual({
      filePath: '/var/folders/65/4xfpkxbj6k14928d02s33cqm0000gn/T/dx-scannercVQa58/src/commands/init.ts(1)(37)',
      severity: 'error',
      type: 'Strings must use doublequote.',
      url: 'https://bitbucket.org/DXHeroes/dx-scanner/src/master/src/commands/init.ts',
    });
    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns practicing, if errorCount !== 0, creates correct linter issue dtos if there are warnings', async () => {
    const report = {
      errorCount: 1,
      results: [
        {
          filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
          messages: [
            {
              ruleId: 'quotes',
              severity: 1,
              message: 'Strings must use doublequote.',
              line: 1,
              column: 37,
              nodeType: 'Literal',
              messageId: 'wrongQuotes',
              endLine: 1,
              endColumn: 58,
              fix: [Object],
            },
          ],
          errorCount: 0,
          warningCount: 1,
          fixableErrorCount: 0,
          fixableWarningCount: 1,
          source: '',
        },
      ],
    };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(practice.data.statistics?.linterIssues).toBeDefined();
    expect(practice.data.statistics?.linterIssues![0]).toEqual({
      filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts(1)(37)',
      severity: 'warning',
      type: 'Strings must use doublequote.',
      url: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
    });

    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Correctly read .eslintrc.json file', async () => {
    const report = {
      errorCount: 0,
      results: [
        {
          filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
          messages: [],
          errorCount: 0,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
        },
      ],
    };
    const mockFileSystem: DirectoryJSON = {
      '/.eslintrc.json': JSON.stringify(eslintrRcJson),
    };
    containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);

    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Correctly read correct .eslintrc.yml file', async () => {
    const report = {
      errorCount: 0,
      results: [
        {
          filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
          messages: [],
          errorCount: 0,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
        },
      ],
    };
    const p = path.join(__dirname, '__MOCKS__/eslintRcMock.yml');

    const mockFileSystem: DirectoryJSON = {
      '/.eslintrc.yml': fs.readFileSync(p, 'utf8'),
    };
    containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);

    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });

    const result = await practice.evaluate(containerCtx.practiceContext);
    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Throw error if it is not correct yaml file', async () => {
    const report = {
      errorCount: 0,
      results: [
        {
          filePath: '/Users/jakubvacek/dx-scanner/src/commands/init.ts',
          messages: [],
          errorCount: 0,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
        },
      ],
    };

    const mockFileSystem: DirectoryJSON = {
      '/.eslintrc.yml': `badYaml: true
      env:
        es6:`,
    };
    containerCtx.virtualFileSystemService.setFileSystem(mockFileSystem);

    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
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
