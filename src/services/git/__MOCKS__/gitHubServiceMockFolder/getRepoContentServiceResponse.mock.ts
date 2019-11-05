import { Directory, File, RepoContentType } from '../../model';

export const getRepoContentServiceResponseDir: Directory = [
  {
    name: 'mockFile.ts',
    path: 'mockFolder/mockFile.ts',
    size: 0,
    sha: '980a0d5f19a64b4b30a87d4206aade58726b60e3',
    type: RepoContentType.file,
  },
];

export const getRepoContentServiceResponseFile: File = {
  name: 'README',
  path: 'README',
  size: 13,
  sha: '980a0d5f19a64b4b30a87d4206aade58726b60e3',
  type: RepoContentType.file,
  content: 'SGVsbG8gV29ybGQhCg==',
  encoding: 'base64',
};
