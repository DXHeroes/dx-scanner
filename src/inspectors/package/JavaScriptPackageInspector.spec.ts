import { JavaScriptPackageInspector } from './JavaScriptPackageInspector';
import { DependencyType } from '../IPackageInspector';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { DirectoryJSON } from 'memfs/lib/volume';
import { packageJSONContents } from '../../detectors/__MOCKS__/JavaScript/packageJSONContents.mock';

describe('JavaScriptPackageInspector', () => {
  let inspector: JavaScriptPackageInspector;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JavaScriptPackageInspector').to(JavaScriptPackageInspector);
    inspector = containerCtx.container.get('JavaScriptPackageInspector');
  });

  beforeEach(async () => {
    containerCtx.container.rebind('JavaScriptPackageInspector').to(JavaScriptPackageInspector);
    inspector = containerCtx.container.get('JavaScriptPackageInspector');

    containerCtx.virtualFileSystemService.setFileSystem({
      'package.json': packageJSONContents,
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
    const pkg = inspector.findPackage('nock');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('nock');
      expect(pkg.dependencyType).toEqual(DependencyType.Dev);
      expect(pkg.requestedVersion.value).toEqual('^10.0.6');
      expect(pkg.requestedVersion.major).toEqual('10');
      expect(pkg.requestedVersion.minor).toEqual('0');
      expect(pkg.requestedVersion.patch).toEqual('6');
    }
  });

  describe('functions', () => {
    describe('#findPackage', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Finds package if it exists', async () => {
        const pkg = inspector.findPackage('nock');
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
        expect(inspector.hasPackage('nock')).toBe(true);
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
        expect(inspector.hasOneOfPackages(['nock', 'rock'])).toBe(true);
      });

      it('Returns false if none of the packages exists', () => {
        expect(inspector.hasOneOfPackages(['rock', 'and', 'roll'])).toBe(false);
      });
    });

    describe('#hasPackageManagement', () => {
      it('returns true if package.json is valid and present', async () => {
        await inspector.init();
        expect(inspector.hasPackageManagement()).toBe(true);
      });

      it('returns false if package.json is invalid', async () => {
        const structure: DirectoryJSON = {
          '/invalid.package.json': '...',
        };

        containerCtx.virtualFileSystemService.setFileSystem(structure);

        await inspector.init();
        expect(inspector.hasPackageManagement()).toBe(false);
      });
    });

    describe('#hasLockFile', () => {
      it('return true if there is a lock file', async () => {
        const structure: DirectoryJSON = {
          'package.json': packageJSONContents,
          'yarn.lock': '...',
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
