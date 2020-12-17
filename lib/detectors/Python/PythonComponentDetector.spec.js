"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PythonComponentDetector_1 = require("./PythonComponentDetector");
const model_1 = require("../../model");
const PythonPackageInspector_1 = require("../../inspectors/package/PythonPackageInspector");
jest.mock('../../inspectors/package/PythonPackageInspector');
describe('PythonComponentDetector', () => {
    let detector;
    const MockedPythonPackageInspector = PythonPackageInspector_1.PythonPackageInspector;
    let mockPythonPackageInspector;
    beforeAll(async () => {
        mockPythonPackageInspector = new MockedPythonPackageInspector();
    });
    describe('Backend', () => {
        it('Detects BE', async () => {
            detector = new PythonComponentDetector_1.PythonComponentDetector(mockPythonPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Python, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Python);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
    });
});
//# sourceMappingURL=PythonComponentDetector.spec.js.map