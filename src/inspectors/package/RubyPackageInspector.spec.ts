import { DependencyType } from '../IPackageInspector';
import { TestContainerContext, createTestContainer } from '../../inversify.config';
import { DirectoryJSON } from 'memfs/lib/volume';
import { RubyPackageInspector } from './RubyPackageInspector';
import { gemfileContents } from '../../detectors/__MOCKS__/Ruby/GemfileContents.mock';

describe('RubyPackageInspector', () => {
  let inspector: RubyPackageInspector;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('RubyPackageInspector').to(RubyPackageInspector);
    inspector = containerCtx.container.get('RubyPackageInspector');
  });

  beforeEach(async () => {
    containerCtx.container.rebind('RubyPackageInspector').to(RubyPackageInspector);
    inspector = containerCtx.container.get('RubyPackageInspector');

    containerCtx.virtualFileSystemService.setFileSystem({
      Gemfile: gemfileContents,
    });
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('It inits and loads packages', async () => {
    await inspector.init();
    expect(inspector.packages!.length).toBeGreaterThan(0);
  });

  it('Parses normal packages correctly', async () => {
    await inspector.init();
    const pkg = inspector.findPackage('after_party');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('after_party');
      expect(pkg.dependencyType).toEqual(DependencyType.Runtime);
    }
  });

  it('Parses the packages correctly with pessimistic version constraint (~>)', async () => {
    await inspector.init();
    const pkg = inspector.findPackage('rails');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('rails');
      expect(pkg.dependencyType).toEqual(DependencyType.Runtime);
      expect(pkg.requestedVersion.value).toEqual('6.0.3');
      expect(pkg.requestedVersion.major).toEqual('6');
      expect(pkg.requestedVersion.minor).toEqual('0');
      expect(pkg.requestedVersion.patch).toEqual('3');
    }
  });

  it('Parses the packages correctly with greater than or equal (>=)', async () => {
    await inspector.init();
    const pkg = inspector.findPackage('bootsnap');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('bootsnap');
      expect(pkg.dependencyType).toEqual(DependencyType.Runtime);
      expect(pkg.requestedVersion.value).toEqual('1.4.2');
      expect(pkg.requestedVersion.major).toEqual('1');
      expect(pkg.requestedVersion.minor).toEqual('4');
      expect(pkg.requestedVersion.patch).toEqual('2');
    }
  });

  it('Parses the packages correctly with multiple constraints (>= and <)', async () => {
    await inspector.init();
    const pkg = inspector.findPackage('pg');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('pg');
      expect(pkg.dependencyType).toEqual(DependencyType.Runtime);
      expect(pkg.requestedVersion.value).toEqual('0.18'); //between 0.18 and 2.0
      expect(pkg.requestedVersion.major).toEqual('0');
      expect(pkg.requestedVersion.minor).toEqual('18');
      expect(pkg.requestedVersion.patch).toEqual('0');
    }
  });

  it('Parses the packages correctly with version number in comment', async () => {
    await inspector.init();
    const pkg = inspector.findPackage('devise');

    if (!pkg) {
      fail();
    } else {
      expect(pkg.name).toEqual('devise');
      expect(pkg.dependencyType).toEqual(DependencyType.Runtime);
      expect(pkg.requestedVersion.value).toEqual('0.0.0');
      expect(pkg.requestedVersion.major).toEqual('0');
      expect(pkg.requestedVersion.minor).toEqual('0');
      expect(pkg.requestedVersion.patch).toEqual('0');
    }
  });

  describe('functions', () => {
    describe('#findPackage', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Finds package if it exists', async () => {
        const pkg = inspector.findPackage('amazing_print');
        expect(pkg).toBeDefined();
      });

      it('Returns undefined if the package does not exist', async () => {
        const pkg = inspector.findPackage('adequite_print');
        expect(pkg).toBeUndefined();
      });
    });

    describe('#hasPackage', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Returns true if package exists', () => {
        expect(inspector.hasPackage('factory_bot_rails')).toBe(true);
      });

      it('Returns false if package does not exists', () => {
        expect(inspector.hasPackage('fantasy_bot_rails')).toBe(false);
      });
    });

    describe('#hasOneOfPackages', () => {
      beforeEach(async () => {
        await inspector.init();
      });

      it('Returns true if one of the packages exists', () => {
        expect(inspector.hasOneOfPackages(['rspec-rails', 'rspec-off-the-rails'])).toBe(true);
      });

      it('Returns false if none of the packages exists', () => {
        expect(inspector.hasOneOfPackages(['rspec-off-the-rails', 'rspec', '-rails'])).toBe(false);
      });
    });

    describe('#hasPackageManagement', () => {
      it('returns true if Gemfile is valid and present', async () => {
        await inspector.init();
        expect(inspector.hasPackageManagement()).toBe(true);
      });

      it('returns false if Gemfile is invalid', async () => {
        const structure: DirectoryJSON = {
          '/Gemfile': '...',
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
