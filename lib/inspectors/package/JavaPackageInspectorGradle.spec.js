"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaPackageInspector_1 = require("./JavaPackageInspector");
const inversify_config_1 = require("../../inversify.config");
const buildGRADLEContents_mock_1 = require("../../detectors/__MOCKS__/Java/buildGRADLEContents.mock");
describe('JavaPackageInspector Gradle', () => {
    let inspector;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaPackageInspector').to(JavaPackageInspector_1.JavaPackageInspector);
        inspector = containerCtx.container.get('JavaPackageInspector');
    });
    beforeEach(async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'build.gradle': buildGRADLEContents_mock_1.buildGRADLEContents,
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
        const pkg = inspector.findPackage('spring-boot-starter-actuator');
        if (!pkg) {
            fail();
        }
        else {
            expect(pkg.name).toEqual('spring-boot-starter-actuator');
            expect(pkg.requestedVersion.value).toEqual('2.1.8');
            expect(pkg.requestedVersion.major).toEqual('2');
            expect(pkg.requestedVersion.minor).toEqual('1');
            expect(pkg.requestedVersion.patch).toEqual('8');
        }
    });
    describe('functions', () => {
        describe('#findPackage', () => {
            beforeEach(async () => {
                await inspector.init();
            });
            it('Returns true if package exists', () => {
                expect(inspector.hasPackage('spring-boot-starter-actuator')).toBe(true);
            });
            it('Returns undefined if the package does not exist', async () => {
                const pkg = inspector.findPackage('spring-boot-autoconfigure');
                expect(pkg).toBeUndefined();
            });
        });
        describe('#hasPackageManagement', () => {
            it('returns true if build.gradle is valid and present', async () => {
                await inspector.init();
                expect(inspector.hasPackageManagement()).toBe(true);
            });
            it('returns true if build.gradle.kts is valid and present', async () => {
                containerCtx.virtualFileSystemService.clearFileSystem();
                containerCtx.virtualFileSystemService.setFileSystem({
                    'build.gradle.kts': buildGRADLEContents_mock_1.buildGRADLEContents,
                });
                await inspector.init();
                expect(inspector.hasPackageManagement()).toBe(true);
            });
        });
        describe('#hasLockFile', () => {
            it('return false if there is no lock file', async () => {
                await inspector.init();
                expect(inspector.hasLockfile()).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=JavaPackageInspectorGradle.spec.js.map