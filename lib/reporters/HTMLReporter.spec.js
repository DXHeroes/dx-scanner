"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HTMLReporter_1 = require("./HTMLReporter");
const PracticeWithContextFactory_1 = require("../test/factories/PracticeWithContextFactory");
const model_1 = require("../model");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
const services_1 = require("../services");
const path_1 = __importDefault(require("path"));
const ScanningStrategy_mock_1 = require("../scanner/__MOCKS__/ScanningStrategy.mock");
describe('HTMLReporter', () => {
    const practicingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory();
    const notPracticingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing });
    const reportPath = path_1.default.resolve(process.cwd(), 'report.html');
    let virtualFileSystemService;
    beforeEach(() => {
        virtualFileSystemService = new services_1.FileSystemService({ isVirtual: true });
        const structure = { [process.cwd()]: null };
        virtualFileSystemService.setFileSystem(structure);
    });
    afterEach(async () => {
        virtualFileSystemService.clearFileSystem();
    });
    describe('#report', () => {
        it('one practicing practice', async () => {
            await new HTMLReporter_1.HTMLReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ html: true }), virtualFileSystemService, ScanningStrategy_mock_1.scanningStrategy).report([
                practicingHighImpactPracticeWithCtx,
            ]);
            const result = await virtualFileSystemService.readFile(reportPath);
            await virtualFileSystemService.deleteFile(reportPath);
            expect(result).toContain('DX Score: 100% | 1/1');
        });
        it('one practicing practice and one not practicing', async () => {
            await new HTMLReporter_1.HTMLReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ html: true }), virtualFileSystemService, ScanningStrategy_mock_1.scanningStrategy).report([
                practicingHighImpactPracticeWithCtx,
                notPracticingHighImpactPracticeWithCtx,
            ]);
            const result = await virtualFileSystemService.readFile(reportPath);
            await virtualFileSystemService.deleteFile(reportPath);
            expect(result).toContain('DX Score: 50% | 1/2');
        });
        it('all impacted practices', async () => {
            await new HTMLReporter_1.HTMLReporter(ArgumentsProviderFactory_1.argumentsProviderFactory({ html: true }), virtualFileSystemService, ScanningStrategy_mock_1.scanningStrategy).report([
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
            const result = await virtualFileSystemService.readFile(reportPath);
            await virtualFileSystemService.deleteFile(reportPath);
            expect(result).toContain('Improvements with highest impact');
            expect(result).toContain('Improvements with medium impact');
            expect(result).toContain('Improvements with minor impact');
            expect(result).toContain('Also consider');
            expect(result).toContain('Evaluation of these practices failed');
            expect(result).toContain('You have turned off these practices');
        });
    });
});
//# sourceMappingURL=HTMLReporter.spec.js.map