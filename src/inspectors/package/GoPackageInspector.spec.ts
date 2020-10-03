import { GoPackageInspector } from './GoPackageInspector';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { DirectoryJSON } from 'memfs/lib/volume';
import { goModContents } from '../../detectors/__MOCKS__/Go/goModContents.mock';

describe('GoPackageInspector go.mod', () => {
  let inspector: GoPackageInspector;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('GoPackageInspector').to(GoPackageInspector);
    inspector = containerCtx.container.get('GoPackageInspector');
  });

  beforeEach(async () => {
    containerCtx.container.rebind('GoPackageInspector').to(GoPackageInspector);
    inspector = containerCtx.container.get('GoPackageInspector');

    containerCtx.virtualFileSystemService.setFileSystem({
      'go.mod': goModContents,
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
    const pkg = inspector.findPackage('github.com/sample/standard');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('github.com/sample/standard');
      expect(pkg.requestedVersion.value).toEqual('1.2.3');
      expect(pkg.requestedVersion.major).toEqual('1');
      expect(pkg.requestedVersion.minor).toEqual('2');
      expect(pkg.requestedVersion.patch).toEqual('3');
    }
  });

  describe('functions', () => {
    describe('#findPackage', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Returns true if package exists', () => {
        expect(inspector.hasPackage('github.com/sample/standard')).toBe(true);
      });

      it('Returns undefined if the package does not exist', async () => {
        const pkg = inspector.findPackage('github.com/sample/no-exist');
        expect(pkg).toBeUndefined();
      });
    });

    describe('#hasPackageManagement', () => {
      it('returns true if go.mod is valid and present', async () => {
        await inspector.init();
        expect(inspector.hasPackageManagement()).toBe(true);
      });
    });

    describe('#hasPackage', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Returns true if package exists', () => {
        expect(inspector.hasPackage('github.com/sample/standard')).toBe(true);
      });

      it('Returns false if package does not exists', () => {
        expect(inspector.hasPackage('github.com/sample/no-exist')).toBe(false);
      });
    });

    describe('#hasOneOfPackages', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Returns true if one of the packages exists', () => {
        expect(inspector.hasOneOfPackages(['github.com/sample/standard', 'github.com/sample/incompatible'])).toBe(true);
      });

      it('Returns false if none of the packages exists', () => {
        expect(inspector.hasOneOfPackages(['github.com/sample/no-exist', 'github.com/sample/kappa'])).toBe(false);
      });
    });

    describe('#hasLockFile', () => {
      it('return true if there is a lock file', async () => {
        const structure: DirectoryJSON = {
          'go.mod': goModContents,
          'go.sum': '...',
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
