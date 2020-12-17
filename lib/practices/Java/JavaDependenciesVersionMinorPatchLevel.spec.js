"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mockPackage_1 = require("../../test/helpers/mockPackage");
const inversify_config_1 = require("../../inversify.config");
const model_1 = require("../../model");
const JavaDependenciesVersionMinorPatchLevel_1 = require("./JavaDependenciesVersionMinorPatchLevel");
const inspectors_1 = require("../../inspectors");
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
describe('JavaDependenciesVersionPractice of Minor and Patch Level', () => {
    let practice;
    let containerCtx;
    const MockedJavaPackageInspector = inspectors_1.JavaPackageInspector;
    let mockJavaPackageInspector;
    const mockedAxios = axios_1.default.get;
    beforeAll(async () => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaDependenciesVersionMinorPatchLevel').to(JavaDependenciesVersionMinorPatchLevel_1.JavaDependenciesVersionMinorPatchLevel);
        practice = containerCtx.container.get('JavaDependenciesVersionMinorPatchLevel');
        mockJavaPackageInspector = new MockedJavaPackageInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('not practicing if newer dependency versions of minor or patch level exists', async () => {
        mockedAxios.mockResolvedValueOnce({ data: { response: { docs: [{ latestVersion: '1.2.1.RELEASE' }] } } });
        mockJavaPackageInspector.packages = [mockPackage_1.mockPackage('org.springframework.boot:spring-boot-starter-actuator')];
        containerCtx.practiceContext.packageInspector.packages = mockJavaPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('practicing if newest dependency version dependency of minor or patch level does not exist', async () => {
        mockedAxios.mockResolvedValueOnce({ data: { response: { docs: [{ latestVersion: '' }] } } });
        mockJavaPackageInspector.packages = [mockPackage_1.mockPackage('org.springframework.boot:spring-boot-starter-actuator')];
        containerCtx.practiceContext.packageInspector.packages = mockJavaPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is Kotlin', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Kotlin;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable if it is not Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JavaDependenciesVersionMinorPatchLevel.spec.js.map