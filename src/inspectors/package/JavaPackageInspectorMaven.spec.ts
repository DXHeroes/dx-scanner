import { JavaPackageInspector } from './JavaPackageInspector';
import { pomXMLContents } from '../../detectors/__MOCKS__/Java/pomXMLContents.mock';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('JavaPackageInspector Maven', () => {
  let inspector: JavaPackageInspector;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaPackageInspector').to(JavaPackageInspector);
    inspector = containerCtx.container.get('JavaPackageInspector');
  });

  beforeEach(async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'pom.xml': pomXMLContents,
    });
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('It inits and loads packages', async () => {
    await inspector.init();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(inspector.packages!.length).toBeGreaterThan(0);
  });

  it('Parses the packages correctly', async () => {
    await inspector.init();
    const pkg = inspector.findPackage('spring-boot-starter-actuator');

    if (!pkg) {
      fail();
    } else {
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

      it('Returns true package if it exists', () => {
        expect(inspector.hasPackage('mysql-connector-java')).toBe(true);
      });

      it('Returns undefined if the package does not exist', async () => {
        const pkg = inspector.findPackage('spring-boot-autoconfigure');
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
