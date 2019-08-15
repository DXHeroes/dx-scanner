import { PackageManagement } from '../model';
import { intersection, keys } from 'lodash';
import * as nodePath from 'path';

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
  let isRelative = !nodePath.isAbsolute(firstPath);

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
