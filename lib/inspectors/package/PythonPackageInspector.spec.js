"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IPackageInspector_1 = require("../IPackageInspector");
const inversify_config_1 = require("../../inversify.config");
const PythonPackageInspector_1 = require("./PythonPackageInspector");
const requirementsTXTContents_mock_1 = require("../../detectors/__MOCKS__/Python/requirementsTXTContents.mock");
describe('PythonPackageInspector', () => {
    let inspector;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('PythonPackageInspector').to(PythonPackageInspector_1.PythonPackageInspector);
        inspector = containerCtx.container.get('PythonPackageInspector');
    });
    beforeEach(async () => {
        containerCtx.container.rebind('PythonPackageInspector').to(PythonPackageInspector_1.PythonPackageInspector);
        inspector = containerCtx.container.get('PythonPackageInspector');
        containerCtx.virtualFileSystemService.setFileSystem({
            'requirements.txt': requirementsTXTContents_mock_1.requirementsTXTContents,
        });
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
    });
    it('It inits and loads packages', async () => {
        await inspector.init();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(inspector.packages.length).toBeGreaterThan(0);
    });
    it('Parses the packages correctly with double equality sign (==)', async () => {
        await inspector.init();
        const pkg = inspector.findPackage('werkzeug');
        if (!pkg) {
            fail();
        }
        else {
            expect(pkg.name).toEqual('werkzeug');
            expect(pkg.dependencyType).toEqual(IPackageInspector_1.DependencyType.Runtime);
            expect(pkg.requestedVersion.value).toEqual('0.16.1');
            expect(pkg.requestedVersion.major).toEqual('0');
            expect(pkg.requestedVersion.minor).toEqual('16');
            expect(pkg.requestedVersion.patch).toEqual('1');
        }
    });
    it('Parses the packages correctly with greater than sign (>=)', async () => {
        await inspector.init();
        const pkg = inspector.findPackage('tqdm');
        if (!pkg) {
            fail();
        }
        else {
            expect(pkg.name).toEqual('tqdm');
            expect(pkg.dependencyType).toEqual(IPackageInspector_1.DependencyType.Runtime);
            expect(pkg.requestedVersion.value).toEqual('1.2.1');
            expect(pkg.requestedVersion.major).toEqual('1');
            expect(pkg.requestedVersion.minor).toEqual('2');
            expect(pkg.requestedVersion.patch).toEqual('1');
        }
    });
    describe('functions', () => {
        describe('#findPackage', () => {
            beforeEach(async () => {
                await inspector.init();
            });
            it('Finds package if it exists', async () => {
                const pkg = inspector.findPackage('connexion');
                expect(pkg).toBeDefined();
            });
            it('Returns undefined if the package does not exist', async () => {
                const pkg = inspector.findPackage('correxion');
                expect(pkg).toBeUndefined();
            });
        });
        describe('#hasPackage', () => {
            beforeEach(async () => {
                await inspector.init();
            });
            it('Returns true if package exists', () => {
                expect(inspector.hasPackage('confluent-kafka')).toBe(true);
            });
            it('Returns false if package does not exists', () => {
                expect(inspector.hasPackage('confluent-kavka')).toBe(false);
            });
        });
        describe('#hasOneOfPackages', () => {
            beforeEach(async () => {
                await inspector.init();
            });
            it('Returns true if one of the packages exists', () => {
                expect(inspector.hasOneOfPackages(['confluent-kafka', 'confluent-kavka'])).toBe(true);
            });
            it('Returns false if none of the packages exists', () => {
                expect(inspector.hasOneOfPackages(['con', 'fluent', '-kafka'])).toBe(false);
            });
        });
        describe('#hasPackageManagement', () => {
            it('returns true if requirements.txt is valid and present', async () => {
                await inspector.init();
                expect(inspector.hasPackageManagement()).toBe(true);
            });
            it('returns false if requirements.txt is invalid', async () => {
                const structure = {
                    '/invalid.requirements.txt': '...',
                };
                containerCtx.virtualFileSystemService.setFileSystem(structure);
                await inspector.init();
                expect(inspector.hasPackageManagement()).toBe(false);
            });
        });
        describe('#hasLockFile', () => {
            it('return false as there is no lock file', async () => {
                await inspector.init();
                expect(inspector.hasLockfile()).toEqual(false);
            });
        });
    });
});
//# sourceMappingURL=PythonPackageInspector.spec.js.map