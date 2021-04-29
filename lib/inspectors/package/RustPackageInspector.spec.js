"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../../inversify.config");
const RustPackageInspector_1 = require("./RustPackageInspector");
const CargoContents_1 = require("../../detectors/__MOCKS__/Rust/CargoContents");
const IPackageInspector_1 = require("../IPackageInspector");
describe('RustPackageInspector', () => {
    let inspector;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('RustPackageInspector').to(RustPackageInspector_1.RustPackageInspector);
        inspector = containerCtx.container.get('RustPackageInspector');
    });
    beforeEach(() => {
        containerCtx.container.rebind('RustPackageInspector').to(RustPackageInspector_1.RustPackageInspector);
        inspector = containerCtx.container.get('RustPackageInspector');
    });
    afterEach(() => {
        containerCtx.virtualFileSystemService.clearFileSystem();
    });
    it('inits correctly even with empty fs', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({});
        await inspector.init();
        expect(inspector.hasPackageManagement()).toBe(false);
        expect(inspector.hasLockfile()).toBe(false);
    });
    it('parses packages correctly', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'Cargo.toml': CargoContents_1.CargoTomlContents,
        });
        await inspector.init();
        expect(inspector.packages).toBeDefined();
        expect(inspector.packages).toStrictEqual([
            {
                name: 'foo2',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '1', minor: '0', patch: '0', value: '1' },
                lockfileVersion: { major: '1', minor: '0', patch: '0', value: '1' },
            },
            {
                name: 'bar',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
                lockfileVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
            },
            {
                name: 'baz',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
                lockfileVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
            },
            {
                name: 'qux',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '4', patch: '0', value: '0.4' },
                lockfileVersion: { major: '0', minor: '4', patch: '0', value: '0.4' },
            },
            {
                name: 'quz',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '1', patch: '2', value: '0.1.2' },
                lockfileVersion: { major: '0', minor: '1', patch: '2', value: '0.1.2' },
            },
        ]);
        expect(inspector.hasPackageManagement()).toBe(true);
        expect(inspector.hasLockfile()).toBe(false);
    });
    it('parses packages correctly with lock file', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'Cargo.toml': CargoContents_1.CargoTomlContents,
            'Cargo.lock': CargoContents_1.CargoLockContents,
        });
        await inspector.init();
        expect(inspector.packages).toBeDefined();
        expect(inspector.packages).toStrictEqual([
            {
                name: 'foo2',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '1', minor: '0', patch: '0', value: '1' },
                lockfileVersion: { major: '1', minor: '0', patch: '1', value: '1.0.1' },
            },
            {
                name: 'bar',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
                lockfileVersion: { major: '0', minor: '1', patch: '0', value: '0.1.0' },
            },
            {
                name: 'baz',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
                lockfileVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
            },
            {
                name: 'qux',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '4', patch: '0', value: '0.4' },
                lockfileVersion: { major: '0', minor: '4', patch: '0', value: '0.4.0' },
            },
            {
                name: 'quz',
                dependencyType: IPackageInspector_1.DependencyType.Runtime,
                requestedVersion: { major: '0', minor: '1', patch: '2', value: '0.1.2' },
                lockfileVersion: { major: '0', minor: '0', patch: '0', value: '0.0.0' },
            },
        ]);
        expect(inspector.hasPackageManagement()).toBe(true);
        expect(inspector.hasLockfile()).toBe(true);
    });
    it('parses workspace correctly', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'Cargo.toml': CargoContents_1.CargoTomlWorkspaceContents,
            'Cargo.lock': CargoContents_1.CargoLockContents,
        });
        await inspector.init();
        expect(inspector.packages).toBeDefined();
        expect(inspector.hasPackageManagement()).toBe(true);
        expect(inspector.hasLockfile()).toBe(true);
    });
});
//# sourceMappingURL=RustPackageInspector.spec.js.map