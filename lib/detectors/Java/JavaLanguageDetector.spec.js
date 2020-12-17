"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const JavaLanguageDetector_1 = require("./JavaLanguageDetector");
const FileInspector_1 = require("../../inspectors/FileInspector");
const model_1 = require("../../model");
const FileSystemService_1 = require("../../services/FileSystemService");
const nodePath = __importStar(require("path"));
describe('JavaLanguageDetector', () => {
    let detector;
    let virtualFileSystemService;
    beforeEach(() => {
        virtualFileSystemService = new FileSystemService_1.FileSystemService({ isVirtual: true });
        const fileInspector = new FileInspector_1.FileInspector(virtualFileSystemService, '/');
        detector = new JavaLanguageDetector_1.JavaLanguageDetector(fileInspector);
    });
    afterEach(async () => {
        virtualFileSystemService.clearFileSystem();
    });
    it('detects java correctly via pom.xml', async () => {
        const structure = {
            '/pom.xml': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Java);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it('detects java correctly via build.gradle', async () => {
        const structure = {
            '/build.gradle': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Java);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it('detects kotlin correctly via build.gradle.kts', async () => {
        const structure = {
            '/build.gradle.kts': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Kotlin);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it('detects java correctly via java extension', async () => {
        const structure = {
            '/*.java': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Java);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it('detects kotlin correctly via kt extension', async () => {
        const structure = {
            '/*.kt': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Kotlin);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it('detects kotlin correctly via kts extension', async () => {
        const structure = {
            '/*.kts': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Kotlin);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it("detects it's not java or kotlin", async () => {
        const structure = {
            '/src/index.none': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(0);
        expect(langAtPath).toEqual([]);
    });
});
//# sourceMappingURL=JavaLanguageDetector.spec.js.map