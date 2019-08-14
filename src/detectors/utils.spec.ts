import { sharedSubpath, hasOneOfPackages } from './utils';
import { PackageManagement, PackageManagementFramework } from '../model';
import * as nodePath from 'path';

describe('DetectorUtils', () => {
  describe('#sharedSubpath', () => {
    it('returns shared path when root is the same', () => {
      expect(sharedSubpath(['/var', '/foo', '/foo/bar'])).toEqual(nodePath.normalize('/'));
    });

    it('returns shared path when dir is the same', () => {
      expect(sharedSubpath(['/foo', '/foo', '/foo/bar'])).toEqual(nodePath.normalize('/foo'));
    });

    it('returns shared path when dir has same prefixes', () => {
      expect(sharedSubpath(['/foo', '/foor', '/foo/bar'])).toEqual(nodePath.normalize('/'));
    });

    it('works with relative paths', () => {
      expect(sharedSubpath(['./foo', './foo', './foo/bar'])).toEqual(nodePath.normalize('./foo'));
    });

    it('works with relative paths - implicit relative path', () => {
      expect(sharedSubpath(['./foo', 'foo', './foo/bar'])).toEqual(nodePath.normalize('./foo'));
    });

    it('works with relative paths - mixed in absolute path', () => {
      // @todo improve sharedSubpath so it can resolve relative paths to absolute ones. Considered edge case for now.
      expect(sharedSubpath(['./foo', '/foo', './foo/bar'])).toEqual(nodePath.normalize('/'));
    });
  });

  describe('#hasOneOfPackages', () => {
    it('returns true if it has one of the packages', () => {
      const pkg = ['@types/node'];
      const pkgManag: PackageManagement = {
        framework: PackageManagementFramework.NPM,
        hasLockfile: true,
        packages: {
          '@types/node': {
            name: '',
          },
        },
      };
      const result = hasOneOfPackages(pkg, pkgManag);
      expect(result).toEqual(true);
    });
  });
});
