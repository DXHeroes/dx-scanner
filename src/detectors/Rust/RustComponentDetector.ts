import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { LanguageAtPath, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';
import { IFileInspector, RustPackageInspector } from '../../inspectors';
import lo from 'lodash';

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
    const hasBinaryFile = Promise.all([
      this.fileInspector.exists('src/main.rs'),
      this.fileInspector
        .readDirectory('src/bin')
        .then(async (entries) => {
          for (const entry of entries) {
            const entryPath = `src/bin/${entry}`;
            if (
              (entry.endsWith('.rs') && (await this.fileInspector.isFile(entryPath))) ||
              (await this.fileInspector.isFile(`${entryPath}/main.rs`))
            ) {
              return true;
            }
          }

          return false;
        })
        .catch((err) => (err.code === 'ENOENT' ? Promise.resolve(false) : Promise.reject(err))),
      Promise.resolve(lo.get(this.packageInspector.cargoManifest, 'bin.length', 0) > 0),
    ]).then((a) => a.some((i) => i));

    // Cargo outputs a library if and only if `src/lib.rs` exists
    const hasLib = this.fileInspector.exists('src/lib.rs');

    if (await hasLib) {
      result.push({
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: ProjectComponentPlatform.BackEnd,
        repositoryPath: undefined,
        type: ProjectComponentType.Library,
      });
    }

    if (await hasBinaryFile) {
      result.push({
        framework: ProjectComponentFramework.UNKNOWN,
        language: langAtPath.language,
        path: langAtPath.path,
        platform: ProjectComponentPlatform.BackEnd,
        repositoryPath: undefined,
        type: ProjectComponentType.Application,
      });
    }

    return result;
  }
}
