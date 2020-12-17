"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaPackageInspector_1 = require("./JavaPackageInspector");
const pomXMLContents_mock_1 = require("../../detectors/__MOCKS__/Java/pomXMLContents.mock");
const inversify_config_1 = require("../../inversify.config");
describe('JavaPackageInspector Maven', () => {
    let inspector;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaPackageInspector').to(JavaPackageInspector_1.JavaPackageInspector);
        inspector = containerCtx.container.get('JavaPackageInspector');
    });
    beforeEach(async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'pom.xml': pomXMLContents_mock_1.pomXMLContents,
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
        const pkg = inspector.findPackage('org.springframework.boot:spring-boot-starter-actuator');
        if (!pkg) {
            fail();
        }
        else {
            expect(pkg.name).toEqual('org.springframework.boot:spring-boot-starter-actuator');
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
                expect(inspector.hasPackage('mysql:mysql-connector-java')).toBe(true);
            });
            it('Returns undefined if the package does not exist', async () => {
                const pkg = inspector.findPackage('org.springframework.boot:spring-boot-autoconfigure');
                expect(pkg).toBeUndefined();
            });
        });
        describe('#hasPackageManagement', () => {
            it('returns true if pom.xml is valid and present', async () => {
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
//# sourceMappingURL=JavaPackageInspectorMaven.spec.js.map