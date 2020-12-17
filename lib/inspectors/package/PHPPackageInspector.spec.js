"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PHPPackageInspector_1 = require("./PHPPackageInspector");
const IPackageInspector_1 = require("../IPackageInspector");
const inversify_config_1 = require("../../inversify.config");
const composerJSONContents_mock_1 = require("../../detectors/__MOCKS__/PHP/composerJSONContents.mock");
describe('PHPPackageInspector', () => {
    let inspector;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('PHPPackageInspector').to(PHPPackageInspector_1.PHPPackageInspector);
        inspector = containerCtx.container.get('PHPPackageInspector');
    });
    beforeEach(async () => {
        containerCtx.container.rebind('PHPPackageInspector').to(PHPPackageInspector_1.PHPPackageInspector);
        inspector = containerCtx.container.get('PHPPackageInspector');
        containerCtx.virtualFileSystemService.setFileSystem({
            'composer.json': composerJSONContents_mock_1.composerJSONContents,
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
    it('Parses the packages correctly', async () => {
        await inspector.init();
        const pkg = inspector.findPackage('justinrainbow/json-schema');
        if (!pkg) {
            fail();
        }
        else {
            expect(pkg.name).toEqual('justinrainbow/json-schema');
            expect(pkg.dependencyType).toEqual(IPackageInspector_1.DependencyType.Runtime);
            expect(pkg.requestedVersion.value).toEqual('^5.2.10');
            expect(pkg.requestedVersion.major).toEqual('5');
            expect(pkg.requestedVersion.minor).toEqual('2');
            expect(pkg.requestedVersion.patch).toEqual('10');
        }
    });
    describe('functions', () => {
        describe('#findPackage', () => {
            beforeEach(async () => {
                await inspector.init();
            });
            it('Finds package if it exists', async () => {
                const pkg = inspector.findPackage('justinrainbow/json-schema');
                expect(pkg).toBeDefined();
            });
            it('Returns undefined if the package does not exist', async () => {
                const pkg = inspector.findPackage('rock');
                expect(pkg).toBeUndefined();
            });
        });
        describe('#hasPackage', () => {
            beforeEach(async () => {
                await inspector.init();
            });
            it('Returns true if package exists', () => {
                expect(inspector.hasPackage('justinrainbow/json-schema')).toBe(true);
            });
            it('Returns false if package does not exists', () => {
                expect(inspector.hasPackage('rock')).toBe(false);
            });
        });
        describe('#hasOneOfPackages', () => {
            beforeEach(async () => {
                await inspector.init();
            });
            it('Returns true if one of the packages exists', () => {
                expect(inspector.hasOneOfPackages(['justinrainbow/json-schema', 'rock'])).toBe(true);
            });
            it('Returns false if none of the packages exists', () => {
                expect(inspector.hasOneOfPackages(['rock', 'and', 'roll'])).toBe(false);
            });
        });
        describe('#hasPackageManagement', () => {
            it('returns true if composer.json is valid and present', async () => {
                await inspector.init();
                expect(inspector.hasPackageManagement()).toBe(true);
            });
            it('returns false if composer.json is invalid', async () => {
                const structure = {
                    '/invalid.composer.json': '...',
                };
                containerCtx.virtualFileSystemService.setFileSystem(structure);
                await inspector.init();
                expect(inspector.hasPackageManagement()).toBe(false);
            });
        });
        describe('#hasLockFile', () => {
            it('return true if there is a lock file', async () => {
                const structure = {
                    'composer.json': composerJSONContents_mock_1.composerJSONContents,
                    'composer.lock': '...',
                };
                containerCtx.virtualFileSystemService.setFileSystem(structure);
                await inspector.init();
                expect(inspector.hasLockfile()).toEqual(true);
            });
            it('return false if there is no lock file', async () => {
                await inspector.init();
                expect(inspector.hasLockfile()).toEqual(false);
            });
        });
    });
});
//# sourceMappingURL=PHPPackageInspector.spec.js.map