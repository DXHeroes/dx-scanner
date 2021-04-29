"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaComponentDetector_1 = require("./JavaComponentDetector");
const model_1 = require("../../model");
const JavaPackageInspector_1 = require("../../inspectors/package/JavaPackageInspector");
const services_1 = require("../../services");
const inspectors_1 = require("../../inspectors");
jest.mock('../../inspectors/package/JavaPackageInspector');
describe('JavaComponentDetector', () => {
    let detector;
    const MockedJavaPackageInspector = JavaPackageInspector_1.JavaPackageInspector;
    let mockJavaPackageInspector;
    let virtualFileSystemService;
    beforeAll(async () => {
        mockJavaPackageInspector = new MockedJavaPackageInspector();
        virtualFileSystemService = new services_1.FileSystemService({ isVirtual: true });
    });
    let fileInspector;
    beforeEach(() => {
        fileInspector = new inspectors_1.FileInspector(virtualFileSystemService, '/');
    });
    afterEach(() => {
        virtualFileSystemService.clearFileSystem();
    });
    describe('Backend', () => {
        it('Detects Java BE', async () => {
            detector = new JavaComponentDetector_1.JavaComponentDetector(mockJavaPackageInspector, fileInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Java, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Java);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
        it('Detects Kotlin BE', async () => {
            detector = new JavaComponentDetector_1.JavaComponentDetector(mockJavaPackageInspector, fileInspector);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Kotlin, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Kotlin);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.BackEnd);
        });
    });
    describe('Android', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('Detects Java Android', async () => {
            detector = new JavaComponentDetector_1.JavaComponentDetector(mockJavaPackageInspector, fileInspector);
            const structure = {
                '/AndroidManifest.xml': '...',
            };
            virtualFileSystemService.setFileSystem(structure);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Java, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Java);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.Android);
        });
        it('Detects Kotlin Android', async () => {
            detector = new JavaComponentDetector_1.JavaComponentDetector(mockJavaPackageInspector, fileInspector);
            const structure = {
                '/AndroidManifest.xml': '...',
            };
            virtualFileSystemService.setFileSystem(structure);
            const components = await detector.detectComponent({ language: model_1.ProgrammingLanguage.Kotlin, path: './src' });
            expect(components[0].language).toEqual(model_1.ProgrammingLanguage.Kotlin);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(model_1.ProjectComponentPlatform.Android);
        });
    });
});
//# sourceMappingURL=JavaComponentDetector.spec.js.map