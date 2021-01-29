"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../../model");
const DependenciesVersionMajorLevel_1 = require("./DependenciesVersionMajorLevel");
const inversify_config_1 = require("../../inversify.config");
const npm_check_updates_1 = __importDefault(require("npm-check-updates"));
const JavaScriptPackageInspector_1 = require("../../inspectors/package/JavaScriptPackageInspector");
const mockPackage_1 = require("../../test/helpers/mockPackage");
jest.mock('npm-check-updates');
describe('DependenciesVersionPractice of Major Level', () => {
    let practice;
    let containerCtx;
    const mockedNcu = npm_check_updates_1.default.run;
    const MockedJSPackageInspector = JavaScriptPackageInspector_1.JavaScriptPackageInspector;
    let mockJsPackageInspector;
    beforeAll(async () => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('DependenciesVersionMajorLevel').to(DependenciesVersionMajorLevel_1.DependenciesVersionMajorLevelPractice);
        practice = containerCtx.container.get('DependenciesVersionMajorLevel');
        mockJsPackageInspector = new MockedJSPackageInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('not practicing if newer package versions exists of major level', async () => {
        mockedNcu.mockImplementation(() => {
            return { 'ts-node': '^8', typescript: '^3' };
        });
        mockJsPackageInspector.packages = [mockPackage_1.mockPackage('typescript')];
        containerCtx.practiceContext.packageInspector.packages = mockJsPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
        expect(practice.data.details).not.toBeUndefined();
    });
    it('practicing if newest package version dependency of major level', async () => {
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
});
//# sourceMappingURL=DependenciesVersionMajorLevel.spec.js.map