"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsPackageJsonConfigurationSetCorrectlyPractice_1 = require("./JsPackageJsonConfigurationSetCorrectlyPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('JsPackageJsonConfigurationSetCorrectlyPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JsPackageJsonConfigurationSetCorrectlyPractice').to(JsPackageJsonConfigurationSetCorrectlyPractice_1.JsPackageJsonConfigurationSetCorrectlyPractice);
        practice = containerCtx.container.get('JsPackageJsonConfigurationSetCorrectlyPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if scripts build, start, test, lint are used', async () => {
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if tscripts build, start, test, lint are NOT used', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/package.json': `{ "scripts": {
              "no": "script"
            }
        }`,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
        expect(practice.data.details).not.toBeUndefined();
    });
    it('Returns unknown if package.json has bad syntax', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            '/package.json': `{ scripts: {
              bad: syntax
            }
        }`,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Returns unknown if there are no file inspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable if it is JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.JavaScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is TypeScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.TypeScript;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable if it is not TypeScript nor JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JsPackageJsonConfigurationSetCorrectlyPractice.spec.js.map