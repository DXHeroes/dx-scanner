"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../../model");
const TypeScriptUsedPractice_1 = require("./TypeScriptUsedPractice");
const model_2 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
describe('TypeScriptUsedPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('TypeScriptUsedPractice').to(TypeScriptUsedPractice_1.TypeScriptUsedPractice);
        practice = containerCtx.container.get('TypeScriptUsedPractice');
    });
    it('Returns true if the language is TypeScript', async () => {
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Returns false if the language is NOT JavaScript', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.UNKNOWN;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
    it('Returns notPracticing if the TypeScript is not used', async () => {
        const result = await practice.evaluate();
        expect(result).toEqual(model_2.PracticeEvaluationResult.notPracticing);
    });
});
//# sourceMappingURL=TypeScriptUsedPractice.spec.js.map