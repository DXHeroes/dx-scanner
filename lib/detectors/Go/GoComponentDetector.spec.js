"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoComponentDetector_1 = require("./GoComponentDetector");
const model_1 = require("../../model");
const GoPackageInspector_1 = require("../../inspectors/package/GoPackageInspector");
jest.mock('../../inspectors/package/GoPackageInspector');
describe('GoComponentDetector', () => {
    let detector;
    const MockedGoPackageInspector = GoPackageInspector_1.GoPackageInspector;
    let mockGoPackageInspector;
    beforeAll(async () => {
        mockGoPackageInspector = new MockedGoPackageInspector();
    });
    describe('Backend', () => {
        it('Detects Go BE', async () => {
            detector = new GoComponentDetector_1.GoComponentDetector(mockGoPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Go, path: '.' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Go);
            expect(components[0].path).toEqual('.');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
        it('Detects Go BE application', async () => {
            detector = new GoComponentDetector_1.GoComponentDetector(mockGoPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Go, path: './cmd' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Go);
            expect(components[0].path).toEqual('./cmd');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
        it('Detects Go BE package', async () => {
            detector = new GoComponentDetector_1.GoComponentDetector(mockGoPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Go, path: './pkg' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Go);
            expect(components[0].path).toEqual('./pkg');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
    });
});
//# sourceMappingURL=GoComponentDetector.spec.js.map