"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inspectors_1 = require("../../inspectors");
const model_1 = require("../../model");
const services_1 = require("../../services");
const RustComponentDetector_1 = require("./RustComponentDetector");
jest.mock('../../inspectors/package/RustPackageInspector');
describe('RustComponentDetector', () => {
    const MockedRustPackageInspector = inspectors_1.RustPackageInspector;
    let mockRustPackageInspector;
    let vfs;
    let detector;
    beforeAll(() => {
        mockRustPackageInspector = new MockedRustPackageInspector();
        vfs = new services_1.FileSystemService({ isVirtual: true });
    });
    beforeEach(() => {
        detector = new RustComponentDetector_1.RustComponentDetector(mockRustPackageInspector, new inspectors_1.FileInspector(vfs, '/project'));
    });
    afterEach(() => {
        vfs.clearFileSystem();
    });
    describe('backend', () => {
        it('detects Rust library', async () => {
            const structure = {
                '/project/src/lib.rs': '...',
            };
            vfs.setFileSystem(structure);
            const components = await detector.detectComponent({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
            });
            expect(components.length).toEqual(1);
            expect(components[0]).toEqual({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
                type: model_1.ProjectComponentType.Library,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
            });
        });
        it('detects Rust application with `src/main.rs`', async () => {
            const structure = {
                '/project/src/main.rs': '...',
            };
            vfs.setFileSystem(structure);
            const components = await detector.detectComponent({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
            });
            expect(components.length).toEqual(1);
            expect(components[0]).toEqual({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
                type: model_1.ProjectComponentType.Application,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
            });
        });
        it('detects Rust application with `src/bin/nested.rs`', async () => {
            const structure = {
                '/project/src/bin/nested.rs': '...',
            };
            vfs.setFileSystem(structure);
            const components = await detector.detectComponent({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
            });
            expect(components.length).toEqual(1);
            expect(components[0]).toEqual({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
                type: model_1.ProjectComponentType.Application,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
            });
        });
        it('detects Rust application with `src/bin/nested/main.rs`', async () => {
            const structure = {
                '/project/src/bin/nested/main.rs': '...',
            };
            vfs.setFileSystem(structure);
            const components = await detector.detectComponent({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
            });
            expect(components.length).toEqual(1);
            expect(components[0]).toEqual({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
                type: model_1.ProjectComponentType.Application,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
            });
        });
        it('detects Rust application with bin entry in cargo manifest', async () => {
            mockRustPackageInspector.cargoManifest = {
                package: {
                    name: '',
                    version: '',
                },
                bin: [
                    {
                        name: 'bar',
                        path: '/project/foo/bar.rs',
                    },
                ],
                target: {},
                dependencies: [],
                'dev-dependencies': [],
                'build-dependencies': [],
            };
            const components = await detector.detectComponent({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
            });
            expect(components.length).toEqual(1);
            expect(components[0]).toEqual({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
                type: model_1.ProjectComponentType.Application,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
            });
        });
        it('detects Rust application and library in all possible forms', async () => {
            const structure = {
                '/project/src/lib.rs': '...',
                '/project/src/main.rs': '...',
                '/project/src/bin/nested.rs': '...',
                '/project/src/bin/nested/main.rs': '...',
            };
            vfs.setFileSystem(structure);
            const components = await detector.detectComponent({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
            });
            expect(components.length).toEqual(2);
            expect(components[0]).toEqual({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
                type: model_1.ProjectComponentType.Library,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
            });
            expect(components[1]).toEqual({
                language: model_1.ProgrammingLanguage.Rust,
                path: '/project',
                type: model_1.ProjectComponentType.Application,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
            });
        });
    });
});
//# sourceMappingURL=RustComponentDetector.spec.js.map