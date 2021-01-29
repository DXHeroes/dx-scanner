"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../inversify.config");
const Scanner_1 = require("./Scanner");
const FileSystemService_1 = require("../services/FileSystemService");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
const model_1 = require("../model");
const jest_mock_extended_1 = require("jest-mock-extended");
describe('Scanner', () => {
    let containerCtx;
    beforeEach(() => {
        containerCtx = inversify_config_1.createTestContainer({ uri: '.' });
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Can be instantiated from container', () => {
        const rootContainer = inversify_config_1.createRootContainer(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' }));
        const scanner = rootContainer.get(Scanner_1.Scanner);
        expect(scanner).toBeDefined();
    });
    /*
      Other tests are missing. They have to be either heavily mocked or
      we have to wait for other components to be finished to write the integration tests.
      (Scanner class is a integration point)
    */
    describe('#init', () => {
        it('configuration can be initialized', async () => {
            containerCtx.container.rebind(FileSystemService_1.FileSystemService).toConstantValue(containerCtx.virtualFileSystemService);
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            let exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
            expect(exists).toEqual(false);
            await scanner.init('/');
            exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
            expect(exists).toEqual(true);
        });
        it('configuration file is not created if a similar file exists', async () => {
            containerCtx.container.rebind(FileSystemService_1.FileSystemService).toConstantValue(containerCtx.virtualFileSystemService);
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            containerCtx.virtualFileSystemService.setFileSystem({
                '/.dxscannerrc.json': '',
            });
            let exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.json');
            expect(exists).toEqual(true);
            exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
            expect(exists).toEqual(false);
            await scanner.init('/');
            exists = await containerCtx.virtualFileSystemService.exists('/.dxscannerrc.yaml');
            expect(exists).toEqual(false);
        });
    });
    describe('fixer', () => {
        const mockFixablePractice = ({ fixFromConfig, id } = {}) => jest_mock_extended_1.mockDeep({
            evaluation: model_1.PracticeEvaluationResult.notPracticing,
            practice: {
                fix: jest.fn(),
                getMetadata: () => ({
                    id: id || 'JavaScript.ESLintWithoutErrorsPractice',
                    name: 'ESLint Without Errors',
                    impact: model_1.PracticeImpact.medium,
                    suggestion: 'Use the ESLint correctly. You have some errors.',
                    reportOnlyOnce: true,
                    url: 'https://dxkb.io/p/linting',
                    dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
                }),
            },
            componentContext: {
                configProvider: {
                    getOverriddenPractice: () => ({
                        impact: model_1.PracticeImpact.high,
                        fix: fixFromConfig,
                    }),
                },
            },
        });
        it('runs fix when fix flag set to true', async () => {
            containerCtx = inversify_config_1.createTestContainer({ uri: 'github.com/DXHeroes/dx-scanner', fix: true });
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            const fixablePractice = mockFixablePractice();
            await scanner.fix([fixablePractice]);
            expect(fixablePractice.practice.fix).toBeCalled();
        });
        it('fix settings from config works', async () => {
            containerCtx = inversify_config_1.createTestContainer({ uri: '.', fix: true });
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            const fixablePractice = mockFixablePractice({ fixFromConfig: false });
            await scanner.fix([fixablePractice]);
            expect(fixablePractice.practice.fix).not.toBeCalled();
        });
        it('fix settings from config works only when fix flag is set', async () => {
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            const fixablePractice = mockFixablePractice({ fixFromConfig: true });
            await scanner.fix([fixablePractice]);
            expect(fixablePractice.practice.fix).not.toBeCalled();
        });
        it('multiple practices can be fixed', async () => {
            containerCtx = inversify_config_1.createTestContainer({ uri: '.', fix: true });
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            const fixablePractice = mockFixablePractice();
            const fixablePracticeB = mockFixablePractice({ id: 'Totally.FakePractice' });
            await scanner.fix([fixablePractice, fixablePracticeB]);
            expect(fixablePractice.practice.fix).toBeCalled();
            expect(fixablePracticeB.practice.fix).toBeCalled();
        });
        it('fixPattern flag works', async () => {
            containerCtx = inversify_config_1.createTestContainer({ uri: '.', fix: true, fixPattern: 'fake' });
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            const fixablePractice = mockFixablePractice();
            const fixablePracticeB = mockFixablePractice({ id: 'Totally.FakePractice' });
            await scanner.fix([fixablePractice, fixablePracticeB]);
            expect(fixablePractice.practice.fix).not.toBeCalled();
            expect(fixablePracticeB.practice.fix).toBeCalled();
        });
        it('fixPattern works only when fix flag is set', async () => {
            containerCtx = inversify_config_1.createTestContainer({ uri: '.', fixPattern: 'fake' });
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            const fixablePractice = mockFixablePractice();
            const fixablePracticeB = mockFixablePractice({ id: 'Totally.FakePractice' });
            await scanner.fix([fixablePractice, fixablePracticeB]);
            expect(fixablePractice.practice.fix).not.toBeCalled();
            expect(fixablePracticeB.practice.fix).not.toBeCalled();
        });
        it('fixPattern flag has higher priority than config', async () => {
            containerCtx = inversify_config_1.createTestContainer({ fix: true, fixPattern: 'lint' });
            const scanner = containerCtx.container.get(Scanner_1.Scanner);
            const fixablePractice = mockFixablePractice({ fixFromConfig: false });
            await scanner.fix([fixablePractice]);
            expect(fixablePractice.practice.fix).toBeCalled();
        });
    });
});
//# sourceMappingURL=Scanner.spec.js.map