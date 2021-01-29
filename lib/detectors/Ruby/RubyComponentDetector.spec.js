"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RubyComponentDetector_1 = require("./RubyComponentDetector");
const model_1 = require("../../model");
const RubyPackageInspector_1 = require("../../inspectors/package/RubyPackageInspector");
jest.mock('../../inspectors/package/RubyPackageInspector');
describe('RubyComponentDetector', () => {
    let detector;
    const MockedRubyPackageInspector = RubyPackageInspector_1.RubyPackageInspector;
    let mockRubyPackageInspector;
    beforeAll(async () => {
        mockRubyPackageInspector = new MockedRubyPackageInspector();
    });
    describe('Backend', () => {
        it('Detects Ruby BackEnd', async () => {
            detector = new RubyComponentDetector_1.RubyComponentDetector(mockRubyPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Ruby, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Ruby);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
    });
});
//# sourceMappingURL=RubyComponentDetector.spec.js.map