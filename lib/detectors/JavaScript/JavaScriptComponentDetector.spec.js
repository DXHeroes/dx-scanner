"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaScriptComponentDetector_1 = require("./JavaScriptComponentDetector");
const model_1 = require("../../model");
const JavaScriptPackageInspector_1 = require("../../inspectors/package/JavaScriptPackageInspector");
const mockPackage_1 = require("../../test/helpers/mockPackage");
jest.mock('../../inspectors/package/JavaScriptPackageInspector');
describe('JavaScriptComponentDetector', () => {
    let detector;
    const MockedJSPackageInspector = JavaScriptPackageInspector_1.JavaScriptPackageInspector;
    let mockJsPackageInspector;
    beforeAll(async () => {
        mockJsPackageInspector = new MockedJSPackageInspector();
    });
    describe('Backend', () => {
        it('Detects BE JS component when te particular packages are present', async () => {
            mockJsPackageInspector.packages = [mockPackage_1.mockPackage('express')];
            mockJsPackageInspector.hasOneOfPackages = (packages) => {
                const files = packages.filter((file) => file === 'express');
                if (files.length > 0) {
                    return true;
                }
                return false;
            };
            detector = new JavaScriptComponentDetector_1.JavaScriptComponentDetector(mockJsPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.JavaScript, path: './src' });
            expect(components.length).toEqual(1);
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.JavaScript);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
    });
    describe('Frontend', () => {
        it('Detects FE JS component when te particular packages are present', async () => {
            mockJsPackageInspector.packages = [mockPackage_1.mockPackage('webpack')];
            mockJsPackageInspector.hasOneOfPackages = (packages) => {
                const files = packages.filter((file) => file === 'webpack');
                if (files.length > 0) {
                    return true;
                }
                return false;
            };
            detector = new JavaScriptComponentDetector_1.JavaScriptComponentDetector(mockJsPackageInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.JavaScript, path: './src' });
            components[0].platform = model_1.ProjectComponentPlatform.FrontEnd;
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.JavaScript);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.FrontEnd);
        });
    });
    it('Detects NO BE JS component nor FE JS when no packages are present', async () => {
        mockJsPackageInspector.hasOneOfPackages = () => false;
        detector = new JavaScriptComponentDetector_1.JavaScriptComponentDetector(mockJsPackageInspector);
        const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.JavaScript, path: './src' });
        expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.UNKNOWN);
    });
});
//# sourceMappingURL=JavaScriptComponentDetector.spec.js.map