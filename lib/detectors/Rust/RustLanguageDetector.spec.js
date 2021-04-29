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
const inspectors_1 = require("../../inspectors");
const model_1 = require("../../model");
const services_1 = require("../../services");
const RustLanguageDetector_1 = require("./RustLanguageDetector");
const nodePath = __importStar(require("path"));
describe('RustLanguageDetector', () => {
    let vfss;
    let detector;
    beforeEach(() => {
        vfss = new services_1.FileSystemService({ isVirtual: true });
        const fileInspector = new inspectors_1.FileInspector(vfss, '/');
        detector = new RustLanguageDetector_1.RustLanguageDetector(fileInspector);
    });
    afterEach(() => {
        vfss.clearFileSystem();
    });
    it('detects Rust correctly by Cargo.toml', async () => {
        const structure = {
            '/project/Cargo.toml': '...',
        };
        vfss.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Rust);
        expect(langAtPath[0].path).toEqual(nodePath.normalize('/project'));
    });
    it('detects Rust correctly by .rs files', async () => {
        const structure = {
            '/project/foo/main.rs': '...',
            '/project/foo/module.rs': '...',
            '/project/foo/module/submodule.rs': '...',
        };
        vfss.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Rust);
        expect(langAtPath[0].path).toEqual(nodePath.normalize('/project/foo'));
    });
    it('detects Rust correctly by .rs files and strips src from path', async () => {
        const structure = {
            '/project/src/main.rs': '...',
            '/project/src/module.rs': '...',
            '/project/src/module/submodule.rs': '...',
        };
        vfss.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Rust);
        expect(langAtPath[0].path).toEqual(nodePath.normalize('/project'));
    });
    it('detects Rust correctly when both Cargo.toml and .rs files are present', async () => {
        const structure = {
            '/project/Cargo.toml': '...',
            '/project/src/module/submodule.rs': '...',
            '/project/src/module/another.rs': '...',
        };
        vfss.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath.length).toEqual(1);
        expect(langAtPath[0].language).toEqual(model_1.ProgrammingLanguage.Rust);
        expect(langAtPath[0].path).toEqual(nodePath.normalize('/project'));
    });
    it('detects it is not Rust', async () => {
        const structure = {
            '/project/Cargo.notoml': '...',
            '/project/src/module/submodule.notrs': '...',
            '/project/src/module/another.notrs': '...',
        };
        vfss.setFileSystem(structure);
        const langAtPath = await detector.detectLanguage();
        expect(langAtPath).toEqual([]);
    });
});
//# sourceMappingURL=RustLanguageDetector.spec.js.map