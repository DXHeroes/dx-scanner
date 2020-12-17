"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const npm_check_updates_1 = __importDefault(require("npm-check-updates"));
const mockPackage_1 = require("../../test/helpers/mockPackage");
const JavaScriptPackageInspector_1 = require("../../inspectors/package/JavaScriptPackageInspector");
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const DependenciesVersionMinorPatchLevel_1 = require("./DependenciesVersionMinorPatchLevel");
jest.mock('npm-check-updates');
describe('DependenciesVersionPractice of Minor and Patch Level', () => {
    let practice;
    let containerCtx;
    const mockedNcu = npm_check_updates_1.default.run;
    const MockedJSPackageInspector = JavaScriptPackageInspector_1.JavaScriptPackageInspector;
    let mockJsPackageInspector;
    beforeAll(async () => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('DependenciesVersionMinorPatchLevel').to(DependenciesVersionMinorPatchLevel_1.DependenciesVersionMinorPatchLevelPractice);
        practice = containerCtx.container.get('DependenciesVersionMinorPatchLevel');
        mockJsPackageInspector = new MockedJSPackageInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('not practicing if newer package versions exists of minor or patch level', async () => {
        mockedNcu.mockImplementation(() => {
            return { 'ts-node': '^8', typescript: '^1.1.0' };
        });
        mockJsPackageInspector.packages = [mockPackage_1.mockPackage('typescript')];
        containerCtx.practiceContext.packageInspector.packages = mockJsPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
        expect(practice.data.details).not.toBeUndefined();
    });
    it('practicing if newest package version dependency of minor or patch level', async () => {
        mockedNcu.mockImplementation(() => {
            return {};
        });
        mockJsPackageInspector.packages = [mockPackage_1.mockPackage('typescript')];
        containerCtx.practiceContext.packageInspector.packages = mockJsPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns true if language is a JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
        expect(isApplicable).toBe(true);
    });
    it('Returns false if language is not a JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const isApplicable = await practice.isApplicable(containerCtx.practiceContext);
        expect(isApplicable).toBe(false);
    });
    it('Returns unknown if there is no packageInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    describe('Fixer', () => {
        it('Runs update of minor level change package', async () => {
            let updateOptions = {};
            mockedNcu.mockImplementation((options) => {
                updateOptions = options;
                return { 'ts-node': '^8', typescript: '^1.1.0' };
            });
            mockJsPackageInspector.packages = [mockPackage_1.mockPackage('typescript')];
            containerCtx.practiceContext.packageInspector.packages = mockJsPackageInspector.packages;
            await practice.evaluate(containerCtx.practiceContext);
            await practice.fix();
            expect(updateOptions).toBeDefined();
            expect(updateOptions.upgrade).toBe(true);
            expect(updateOptions.filter).toContain('typescript');
        });
        it('Updates both patch and minor versions', async () => {
            let updateOptions = {};
            mockedNcu.mockImplementation((options) => {
                updateOptions = options;
                return { dummy: '^1.0.1', typescript: '^1.1.0' };
            });
            mockJsPackageInspector.packages = [mockPackage_1.mockPackage('typescript'), mockPackage_1.mockPackage('dummy')];
            containerCtx.practiceContext.packageInspector.packages = mockJsPackageInspector.packages;
            await practice.evaluate(containerCtx.practiceContext);
            await practice.fix();
            expect(updateOptions).toBeDefined();
            expect(updateOptions.upgrade).toBe(true);
            expect(updateOptions.filter).toContain('typescript');
            expect(updateOptions.filter).toContain('dummy');
        });
    });
});
//# sourceMappingURL=DependenciesVersionMinorPatchLevel.spec.js.map