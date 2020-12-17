"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const ScanningStrategy_mock_1 = require("../scanner/__MOCKS__/ScanningStrategy.mock");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
const PracticeWithContextFactory_1 = require("../test/factories/PracticeWithContextFactory");
const CLIReporter_1 = require("./CLIReporter");
describe('CLIReporter', () => {
    const practicingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory();
    const notPracticingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing });
    describe('#report', () => {
        it('one practicing practice', () => {
            const result = new CLIReporter_1.CLIReporter(ArgumentsProviderFactory_1.argumentsProviderFactory(), ScanningStrategy_mock_1.scanningStrategy).buildReport([practicingHighImpactPracticeWithCtx]);
            expect(result).toContain('DX Score: 100% | 1/1');
        });
        it('one practicing practice and one not practicing', () => {
            const result = new CLIReporter_1.CLIReporter(ArgumentsProviderFactory_1.argumentsProviderFactory(), ScanningStrategy_mock_1.scanningStrategy).buildReport([
                practicingHighImpactPracticeWithCtx,
                notPracticingHighImpactPracticeWithCtx,
            ]);
            expect(result).toContain('DX Score: 50% | 1/2');
        });
        it('all impacted practices', () => {
            const result = new CLIReporter_1.CLIReporter(ArgumentsProviderFactory_1.argumentsProviderFactory(), ScanningStrategy_mock_1.scanningStrategy).buildReport([
                practicingHighImpactPracticeWithCtx,
                notPracticingHighImpactPracticeWithCtx,
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.medium,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.small,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.hint,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({
                    overridenImpact: model_1.PracticeImpact.off,
                    evaluation: model_1.PracticeEvaluationResult.notPracticing,
                    isOn: false,
                }),
                PracticeWithContextFactory_1.practiceWithContextFactory({ overridenImpact: model_1.PracticeImpact.high, evaluation: model_1.PracticeEvaluationResult.unknown }),
            ]);
            expect(result).toContain('Improvements with highest impact');
            expect(result).toContain('Improvements with medium impact');
            expect(result).toContain('Improvements with minor impact');
            expect(result).toContain('Also consider');
            expect(result).toContain('Evaluation of these practices failed');
            expect(result).toContain('You have turned off these practices');
        });
    });
});
//# sourceMappingURL=CLIReporter.spec.js.map