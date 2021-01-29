"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PHPComponentDetector_1 = require("./PHPComponentDetector");
const model_1 = require("../../model");
const PHPPackageInspector_1 = require("../../inspectors/package/PHPPackageInspector");
jest.mock('../../inspectors/package/PHPPackageInspector');
describe('PHPComponentDetector', () => {
    let detector;
    const MockedPHPPackageInspector = PHPPackageInspector_1.PHPPackageInspector;
    let mockPHPPackageInspector;
    beforeAll(async () => {
        mockPHPPackageInspector = new MockedPHPPackageInspector();
    });
    describe('Backend', () => {
        it('Detects PHP BE', async () => {
            detector = new PHPComponentDetector_1.PHPComponentDetector(mockPHPPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.PHP, path: '.' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.PHP);
            expect(components[0].path).toEqual('.');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
    });
});
//# sourceMappingURL=PHPComponentDetector.spec.js.map