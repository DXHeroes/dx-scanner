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
const RubyLanguageDetector_1 = require("./RubyLanguageDetector");
describe('RubyLanguageDetector', () => {
    let detector;
    let virtualFileSystemService;
    beforeEach(() => {
        virtualFileSystemService = new FileSystemService_1.FileSystemService({ isVirtual: true });
        const fileInspector = new FileInspector_1.FileInspector(virtualFileSystemService, '/');
        detector = new RubyLanguageDetector_1.RubyLanguageDetector(fileInspector);
    });
    afterEach(async () => {
        virtualFileSystemService.clearFileSystem();
    });
    it('detects ruby correctly via Gemfile', async () => {
        const structure = {
            '/Gemfile': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Ruby);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
    it("detects it's not a ruby file", async () => {
        const structure = {
            '/src/index.none': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(0);
        expect(langAtPath).toEqual([]);
    });
    it('detects ruby correctly via rb file', async () => {
        const structure = {
            '/index.rb': '...',
        };
        virtualFileSystemService.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Ruby);
        expect(langAtPath[0].path).toEqual(nodePath.sep);
    });
});
//# sourceMappingURL=RubyLanguageDetector.spec.js.map