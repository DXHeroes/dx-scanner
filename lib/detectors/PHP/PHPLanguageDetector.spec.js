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
const FileInspector_1 = require("../../inspectors/FileInspector");
const model_1 = require("../../model");
const FileSystemService_1 = require("../../services/FileSystemService");
const nodePath = __importStar(require("path"));
const PHPLanguageDetector_1 = require("./PHPLanguageDetector");
describe('PHPLanguageDetector', () => {
    let detector;
    let virtualFileSystemService;
    beforeEach(() => {
        virtualFileSystemService = new FileSystemService_1.FileSystemService({ isVirtual: true });
        const fileInspector = new FileInspector_1.FileInspector(virtualFileSystemService, '/');
        detector = new PHPLanguageDetector_1.PHPLanguageDetector(fileInspector);
    });
    afterEach(async () => {
        virtualFileSystemService.clearFileSystem();
    });
    it("detects it's not a php file", async () => {
        const structure = {
            '/src/index.none': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(0);
        expect(langAtPath).toEqual([]);
    });
    it('detects php correctly via composer file', async () => {
        const structure = {
            '/composer.json': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.PHP);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it('detects php correctly via php file', async () => {
        const structure = {
            '/index.php': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.PHP);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
});
//# sourceMappingURL=PHPLanguageDetector.spec.js.map