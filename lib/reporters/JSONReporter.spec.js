"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONReporter_1 = require("./JSONReporter");
const PracticeWithContextFactory_1 = require("../test/factories/PracticeWithContextFactory");
const model_1 = require("../model");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
describe('JSONReporter', () => {
    const practicingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory();
    const notPracticingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing });
    describe('#report', () => {
        it('one practicing practice', () => {
            const result = new JSONReporter_1.JSONReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' })).buildReport([practicingHighImpactPracticeWithCtx]);
            expect(result).toHaveProperty('components');
            expect(result).toHaveProperty('uri');
            expect(result.components).toHaveLength(1);
            expect(result.components[0].practices).toHaveLength(1);
        });
        it('one practicing practice and one not practicing', () => {
            const result = new JSONReporter_1.JSONReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ uri: '.' })).buildReport([
                practicingHighImpactPracticeWithCtx,
                notPracticingHighImpactPracticeWithCtx,
            ]);
            expect(result).toHaveProperty('components');
            expect(result).toHaveProperty('uri');
            expect(result.components).toHaveLength(1);
            expect(result.components[0].practices).toHaveLength(2);
        });
    });
});
//# sourceMappingURL=JSONReporter.spec.js.map