import { GolangPackageInspector } from './GolangPackageInspector';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { DirectoryJSON } from 'memfs/lib/volume';
import { goModContents } from '../../detectors/__MOCKS__/Golang/goModContents.mock';

describe('GolangPackageInspector go.mod', () => {
  let inspector: GolangPackageInspector;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('GolangPackageInspector').to(GolangPackageInspector);
    inspector = containerCtx.container.get('GolangPackageInspector');
  });

  beforeEach(async () => {
    containerCtx.container.rebind('GolangPackageInspector').to(GolangPackageInspector);
    inspector = containerCtx.container.get('GolangPackageInspector');

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
    const pkg = inspector.findPackage('github.com/go-errors/errors');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('github.com/go-errors/errors');
      expect(pkg.requestedVersion.value).toEqual('1.0.1');
      expect(pkg.requestedVersion.major).toEqual('1');
      expect(pkg.requestedVersion.minor).toEqual('0');
      expect(pkg.requestedVersion.patch).toEqual('1');
    }
  });

  describe('functions', () => {
    describe('#findPackage', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Returns true if package exists', () => {
        expect(inspector.hasPackage('github.com/go-errors/errors')).toBe(true);
      });

      it('Returns undefined if the package does not exist', async () => {
        const pkg = inspector.findPackage('github.com/spf13/cobra');
        expect(pkg).toBeUndefined();
      });
    });

    describe('#hasPackageManagement', () => {
      it('returns true if go.mod is valid and present', async () => {
        await inspector.init();
        expect(inspector.hasPackageManagement()).toBe(true);
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
