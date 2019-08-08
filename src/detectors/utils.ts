import { PackageManagement } from '../model';
import { intersection, keys } from 'lodash';
import { Metadata } from '../services/model';
import { GitHubFile } from '../services/git/IGitHubService';
import * as nodePath from "path"

export const dirPath = (file: GitHubFile | Metadata): string => {
  const isRelative = !nodePath.isAbsolute(file.path)
  const prefix = isRelative ? '/' : './';
  let path = !file.path.startsWith(prefix) ? `${prefix}${file.path}` : file.path;
  if (file.path.startsWith(`./${file.name}`) || file.path.startsWith(`${file.name}`)) {
    return './';
  }
  let dir = path.replace(`/${file.name}`, '');
  if (dir === '') {
    return prefix;
  }
  if (dir.endsWith('/')) {
    return dir.substring(0, dir.length - 1);
  }
  return dir;
};

export const fileExtensionRegExp = (extensions: string[]): RegExp => {
  const regExpString = `.*\\.(${extensions.join('|').replace('.', '\\.')})$`;
  return new RegExp(regExpString, 'i');
};

export const fileNameRegExp = (name: string): RegExp => {
  return new RegExp(`^${name.replace('.', '\\.')}$`, 'i');
};

export const sharedSubpath = (array: string[]): string => {
  const A = array.concat().sort();
  const a1 = A[0];
  const a2 = A[A.length - 1];
  let isRelative = false;
  if (!a1.startsWith('/')) {
    isRelative = true;
  }
  if (a2.startsWith('/') && isRelative) {
    return '/';
  }
  const a1Splitted = a1.split('/').filter((p) => p !== '' && p !== '.');
  const a2Splitted = a2.split('/').filter((p) => p !== '' && p !== '.');
  const L = a1Splitted.length;

  let i = 0;
  while (i < L && a1Splitted[i] === a2Splitted[i]) {
    i++;
  }
  return `${isRelative ? './' : '/'}${a1Splitted.slice(0, i).join('/')}`;
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
