import { PackageManagement, PracticeEvaluationResult } from '../model';
import { intersection, keys } from 'lodash';
import * as nodePath from 'path';
import { coerce, valid } from 'semver';
import { PackageVersion } from '../inspectors/IPackageInspector';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import ncu from 'npm-check-updates';

export const fileExtensionRegExp = (extensions: string[]): RegExp => {
  const regExpString = `.*\\.(${extensions.join('|').replace('.', '\\.')})$`;
  return new RegExp(regExpString, 'i');
};

export const fileNameRegExp = (name: string): RegExp => {
  return new RegExp(`^${name.replace('.', '\\.')}$`, 'i');
};

/**
 * Get common prefix of all paths
 */
export const sharedSubpath = (paths: string[]): string => {
  const sep = nodePath.sep;
  paths = paths
    .concat()
    .map((p) => p.split(nodePath.posix.sep).join(sep))
    .sort();

  const firstPath = paths[0];
  const lastPath = paths[paths.length - 1];
  const isRelative = !nodePath.isAbsolute(firstPath);

  if (lastPath.startsWith(sep) && isRelative) return sep;

  const firstPathSplit = firstPath.split(sep).filter((p) => p !== '' && p !== '.');
  const lastPathSplit = lastPath.split(sep).filter((p) => p !== '' && p !== '.');

  const length = firstPathSplit.length;
  let i = 0;
  while (i < length && firstPathSplit[i] === lastPathSplit[i]) {
    i++;
  }

  return `${isRelative ? `.${sep}` : sep}${firstPathSplit.slice(0, i).join(sep)}`;
};

export const indexBy = <T>(array: T[], keyFn: (item: T) => string): { [index: string]: T } => {
  const map: { [index: string]: T } = {};
  array.forEach((item) => {
    map[keyFn(item)] = item;
  });
  return map;
};

export const hasOneOfPackages = (packages: string[], packageManagement?: PackageManagement): boolean => {
  if (!packageManagement) {
    return false;
  }
  if (intersection(keys(packageManagement.packages), packages).length > 0) {
    return true;
  }
  return false;
};

export const semverToPackageVersion = (semverString: string): PackageVersion | undefined => {
  const coerced = coerce(semverString);
  if (coerced) {
    const version = valid(coerced);
    if (version) {
      const splitted = version.split('.');
      return {
        value: semverString,
        major: splitted[0],
        minor: splitted[1],
        patch: splitted[2],
      };
    }
  }
  return undefined;
};

export const evaluateBySemverLevel = async (ctx: PracticeContext, semverVersion: SemverVersion) => {
  if (ctx.fileInspector === undefined || ctx.packageInspector === undefined) {
    return PracticeEvaluationResult.unknown;
  }

  const pkgs = ctx.packageInspector.packages;
  const fakePkgJson: { dependencies: { [key: string]: string } } = { dependencies: {} };

  pkgs &&
    pkgs.forEach((p) => {
      fakePkgJson.dependencies[p.name] = p.requestedVersion.value;
    });

  const result = await ncu.run({
    packageData: JSON.stringify(fakePkgJson),
  });

  for (const property in result) {
    const parsedVersion = semverToPackageVersion(result[property]);
    if (parsedVersion) {
      for (const pkg of ctx.packageInspector.packages!) {
        if (pkg.name === property) {
          if (parsedVersion[semverVersion] > pkg.lockfileVersion[semverVersion]) {
            return PracticeEvaluationResult.notPracticing;
          }
        }
      }
    }
  }

  return PracticeEvaluationResult.practicing;
};

export enum SemverVersion {
  major = 'major',
  minor = 'minor',
  patch = 'patch',
}
