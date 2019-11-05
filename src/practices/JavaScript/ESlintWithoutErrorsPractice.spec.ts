import { CLIEngine } from 'eslint';
import { DirectoryJSON } from 'memfs/lib/volume';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { PracticeEvaluationResult } from '../../model';
import { ESLintWithoutErrorsPractice } from './ESLintWithoutErrorsPractice';
import * as fs from 'fs';
import path from 'path';
import { eslintrRcJson } from './__MOCKS__/eslintRcMockJson';
jest.mock('eslint');

describe('ESLintWithoutErrorsPractice', () => {
  let practice: ESLintWithoutErrorsPractice;
  let containerCtx: TestContainerContext;

  const mockedEslint = <jest.Mock>(<unknown>CLIEngine);

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('ESLintWithoutErrorsPractice').to(ESLintWithoutErrorsPractice);
    practice = containerCtx.container.get('ESLintWithoutErrorsPractice');
  });

  afterEach(() => {
    containerCtx.practiceContext.fileInspector!.purgeCache();
  });

  it('Returns practicing, if errorCount === 0', async () => {
    const report = { errorCount: 0 };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns not practicing, if errorCount !== 0', async () => {
    const report = { errorCount: 1 };
    mockedEslint.mockImplementation(() => {
      return {
        executeOnFiles: () => report,
      };
    });
    const result = await practice.evaluate(containerCtx.practiceContext);

    expect(result).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Correctly read .eslintrc.json file', async () => {
    const report = { errorCount: 0 };
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
    const report = { errorCount: 0 };
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
    const report = { errorCount: 0 };

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
