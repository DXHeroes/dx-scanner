import { JavaPackageInspector } from './JavaPackageInspector';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { buildGRADLEContents } from '../../detectors/__MOCKS__/Java/buildGRADLEContents.mock';

describe('JavaPackageInspector Gradle', () => {
  let inspector: JavaPackageInspector;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaPackageInspector').to(JavaPackageInspector);
    inspector = containerCtx.container.get('JavaPackageInspector');
  });

  beforeEach(async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      'build.gradle': buildGRADLEContents,
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
          'build.gradle.kts': buildGRADLEContents,
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
