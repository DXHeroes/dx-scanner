import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { LanguageAtPath, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';
import { IFileInspector, RustPackageInspector } from '../../inspectors';
import _ from 'lodash';
import nodePath from 'path';
import { ErrorFactory } from '../../lib/errors';

@injectable()
export class RustComponentDetector implements IProjectComponentDetector {
  constructor(
    private readonly packageInspector: RustPackageInspector,
    @inject(Types.IFileInspector) private readonly fileInspector: IFileInspector,
  ) {}

  async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
    const result: ProjectComponent[] = [];

    // Cargo outputs a binary output when it finds:
    // * `src/main.rs`
    // * `src/bin/*.rs`
    // * `src/bin/*/main.rs`
    // * a `bin` entry in the manifest
    const hasMain = await this.fileInspector.exists(nodePath.join('src', 'main.rs'));
    let hasSrcBin = false;
    try {
      const binFolderEntries = await this.fileInspector.readDirectory(nodePath.join('src', 'bin'));
      for (const entry of binFolderEntries) {
        const entryPath = nodePath.join('src', 'bin', entry);

        const isRsFile = entry.endsWith('.rs') && (await this.fileInspector.isFile(entryPath));
        if (isRsFile) {
          hasSrcBin = true;
          break;
        }

        const hasNestedMain = await this.fileInspector.isFile(nodePath.join(entryPath, 'main.rs'));
        if (hasNestedMain) {
          hasSrcBin = true;
          break;
        }
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        // ignore
      } else {
        throw e;
      }
    }
    const hasManifestBin = _.get(this.packageInspector.cargoManifest, 'bin.length', 0) > 0;
    const hasBinaryFile = hasMain || hasSrcBin || hasManifestBin;

    // Cargo outputs a library if and only if `src/lib.rs` exists
    const hasLib = await this.fileInspector.exists(nodePath.join('src', 'lib.rs'));

    if (hasLib) {
      result.push({
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: ProjectComponentPlatform.BackEnd,
        repositoryPath: undefined,
        type: ProjectComponentType.Library,
      });
    }

    if (hasBinaryFile) {
      result.push({
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: ProjectComponentPlatform.BackEnd,
        repositoryPath: undefined,
        type: ProjectComponentType.Application,
      });
    }

    if (result.length == 0) {
      throw ErrorFactory.newInternalError(
        `Could not detect neither a library nor a binary Rust crate at given language path: ${langAtPath.path}`,
      );
    }

    return result;
  }
}
