"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaComponentDetector_1 = require("./JavaComponentDetector");
const model_1 = require("../../model");
const JavaPackageInspector_1 = require("../../inspectors/package/JavaPackageInspector");
jest.mock('../../inspectors/package/JavaPackageInspector');
describe('JavaComponentDetector', () => {
    let detector;
    const MockedJavaPackageInspector = JavaPackageInspector_1.JavaPackageInspector;
    let mockJavaPackageInspector;
    beforeAll(async () => {
        mockJavaPackageInspector = new MockedJavaPackageInspector();
    });
    describe('Backend', () => {
        it('Detects Java BE', async () => {
            detector = new JavaComponentDetector_1.JavaComponentDetector(mockJavaPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Java, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Java);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
        it('Detects Kotlin BE', async () => {
            detector = new JavaComponentDetector_1.JavaComponentDetector(mockJavaPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Kotlin, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Kotlin);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
    });
});
//# sourceMappingURL=JavaComponentDetector.spec.js.map