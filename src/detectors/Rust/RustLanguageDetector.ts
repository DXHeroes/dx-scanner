import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileExtensionRegExp, fileNameRegExp, sharedSubpath } from '../utils';
import _ from 'lodash';
import * as nodePath from 'path';

@injectable()
export class RustLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];

    let manifestFiles: LanguageAtPath[];
    {
      const arr = await this.fileInspector.scanFor(fileNameRegExp('Cargo.toml'), '/');
      manifestFiles = arr.map((file) => {
        return {
          language: ProgrammingLanguage.Rust,
          path: nodePath.dirname(file.path),
        };
      });
    }

    // * `foo/bar.rs` => `foo/`
    // * `foo/bar/baz.rs, foo/bar/qux.rs` => `foo/bar/`
    // * `foo/bar.rs, `baz/qux.rs` => `.`
    // And specially: `foo/src/foo.rs, foo/src/bar.rs` => `foo/` (skips `src`)
    let rustSources: LanguageAtPath[];
    {
      const files = await this.fileInspector.scanFor(fileExtensionRegExp(['rs']), '/');
      const uniqueDirs = _.uniq(files.map((f) => nodePath.dirname(f.path)));

      if (uniqueDirs.length === 0) {
        rustSources = [];
      } else {
        let commonPath = sharedSubpath(uniqueDirs);
        if (nodePath.basename(commonPath) === 'src') {
          commonPath = nodePath.dirname(commonPath);
        }

        rustSources = [
          {
            language: ProgrammingLanguage.Rust,
            path: commonPath,
          },
        ];
      }
    }
    // remove from `rustSources` all such paths that already have
    // a `Cargo.toml` anywhere in their ancestor path
    _.pullAllWith(rustSources, manifestFiles, (source, manifest) => sharedSubpath([manifest.path, source.path]) === manifest.path);

    result.push(...manifestFiles, ...rustSources);

    return result;
  }
}
