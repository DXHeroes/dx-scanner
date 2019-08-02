import { sharedSubpath, dirPath, hasOneOfPackages } from './utils';
import { MetadataType } from '../services/model';
import { PackageManagement, PackageManagementFramework } from '../model';

describe('DetectorUtils', () => {
  describe('#dirPath', () => {
    it('returns path to the file', () => {
      const dir = dirPath({
        name: 'package.json',
        path: '/foo/var/package.json',
        baseName: 'package',
        extension: 'json',
        size: 123,
        type: MetadataType.file,
      });
      expect(dir).toEqual('/foo/var');
    });

    it('returns path to the file while the file is in absolute root', () => {
      const dir = dirPath({
        name: 'package.json',
        path: '/package.json',
        baseName: 'package',
        extension: 'json',
        size: 123,
        type: MetadataType.file,
      });
      expect(dir).toEqual('/');
    });

    it('returns path to the relative file', () => {
      const dir = dirPath({
        name: 'package.json',
        path: './foo/var/package.json',
        baseName: 'package',
        extension: 'json',
        size: 123,
        type: MetadataType.file,
      });
      expect(dir).toEqual('./foo/var');
    });

    it('returns path to the relative file in root', () => {
      const dir = dirPath({
        name: 'package.json',
        path: './package.json',
        baseName: 'package',
        extension: 'json',
        size: 123,
        type: MetadataType.file,
      });
      expect(dir).toEqual('./');
    });
  });

  describe('#sharedSubpath', () => {
    it('returns shared path when root is the same', () => {
      expect(sharedSubpath(['/var', '/foo', '/foo/bar'])).toEqual('/');
    });
    it('returns shared path when dir is the same', () => {
      expect(sharedSubpath(['/foo', '/foo', '/foo/bar'])).toEqual('/foo');
    });

    it('returns shared path when dir has same prefixes', () => {
      expect(sharedSubpath(['/foo', '/foor', '/foo/bar'])).toEqual('/');
    });

    it('works with relative paths', () => {
      expect(sharedSubpath(['./foo', './foo', './foo/bar'])).toEqual('./foo');
    });

    it('works with relative paths - implicit relative path', () => {
      expect(sharedSubpath(['./foo', 'foo', './foo/bar'])).toEqual('./foo');
    });

    it('works with relative paths - mixed in absolute path', () => {
      // @todo improve sharedSubpath so it can resolve relative paths to absolute ones. Considered edge case for now.
      expect(sharedSubpath(['./foo', '/foo', './foo/bar'])).toEqual('/');
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
