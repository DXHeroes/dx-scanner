"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../../model");
const ScanningStrategy_mock_1 = require("../../scanner/__MOCKS__/ScanningStrategy.mock");
const PracticeWithContextFactory_1 = require("../../test/factories/PracticeWithContextFactory");
const CIReportBuilder_1 = require("./CIReportBuilder");
describe('CIReportBuilder', () => {
    const practicingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({ practice: { name: 'practicing1', url: './practicing' } });
    const notPracticingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({
        practice: { name: 'notPracticing1', url: './notPracticing' },
        evaluation: model_1.PracticeEvaluationResult.notPracticing,
    });
    describe('#build', () => {
        it('one practicing practice contains all necessary data', () => {
            const result = new CIReportBuilder_1.CIReportBuilder([practicingHighImpactPracticeWithCtx], ScanningStrategy_mock_1.scanningStrategy).build();
            const mustContainElements = [CIReportBuilder_1.CIReportBuilder.ciReportIndicator];
            mustContainElements.forEach((e) => {
                expect(result).toContain(e);
            });
        });
        it('one practicing practice and one not practicing', () => {
            const result = new CIReportBuilder_1.CIReportBuilder([practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx], ScanningStrategy_mock_1.scanningStrategy).build();
            const mustContainElements = [
                CIReportBuilder_1.CIReportBuilder.ciReportIndicator,
                notPracticingHighImpactPracticeWithCtx.practice.name,
                notPracticingHighImpactPracticeWithCtx.practice.url,
            ];
            const mustNotContainElements = [practicingHighImpactPracticeWithCtx.practice.name, practicingHighImpactPracticeWithCtx.practice.url];
            mustContainElements.forEach((e) => {
                expect(result).toContain(e);
            });
            mustNotContainElements.forEach((e) => {
                expect(result).not.toContain(e);
            });
        });
        it('all impacted practices', () => {
            const result = new CIReportBuilder_1.CIReportBuilder([
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
            ], ScanningStrategy_mock_1.scanningStrategy).build();
            expect(result).toContain('Improvements with highest impact');
            expect(result).toContain('Improvements with medium impact');
            expect(result).toContain('Improvements with minor impact');
            expect(result).toContain('Also consider');
            expect(result).toContain('Evaluation of these practices failed');
            expect(result).toContain('You have turned off these practices');
        });
    });
});
//# sourceMappingURL=CIReportBuilder.spec.js.map