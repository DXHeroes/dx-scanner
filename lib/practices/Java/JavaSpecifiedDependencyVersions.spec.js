"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaSpecifiedDependencyVersions_1 = require("./JavaSpecifiedDependencyVersions");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const inspectors_1 = require("../../inspectors");
const mockPackage_1 = require("../../test/helpers/mockPackage");
describe('JavaSpecifiedDependencyVersions', () => {
    let practice;
    let containerCtx;
    const MockedJavaPackageInspector = inspectors_1.JavaPackageInspector;
    let mockJavaPackageInspector;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaSpecifiedDependencyVersions').to(JavaSpecifiedDependencyVersions_1.JavaSpecifiedDependencyVersions);
        practice = containerCtx.container.get('JavaSpecifiedDependencyVersions');
        mockJavaPackageInspector = new MockedJavaPackageInspector();
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
        containerCtx.practiceContext.packageInspector.packages = [];
    });
    it('Returns practicing if there are specified versions', async () => {
        mockJavaPackageInspector.packages = [mockPackage_1.mockPackage('org.springframework.boot:spring-boot-starter-actuator', '2.1.8')];
        containerCtx.practiceContext.packageInspector.packages = mockJavaPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns NOT practicing if not all versions are specified', async () => {
        mockJavaPackageInspector.packages = [mockPackage_1.mockPackage('org.springframework.boot:spring-boot-starter-actuator', '')];
        containerCtx.practiceContext.packageInspector.packages = mockJavaPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns unknown if there are NO packages', async () => {
        mockJavaPackageInspector.packages = undefined;
        containerCtx.practiceContext.packageInspector.packages = mockJavaPackageInspector.packages;
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Returns unknown if there is no packageInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { packageInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable to Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is Kotlin', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Kotlin;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable to other languages', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Python;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JavaSpecifiedDependencyVersions.spec.js.map