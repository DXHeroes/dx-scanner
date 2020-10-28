import { ILanguageDetector } from '../ILanguageDetector';
import { injectable, inject } from 'inversify';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { Types } from '../../types';
import { fileExtensionRegExp, fileNameRegExp, sharedSubpath } from '../utils';
import lo from 'lodash';
import * as nodePath from 'path';

@injectable()
export class RustLanguageDetector implements ILanguageDetector {
  private fileInspector: IFileInspector;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
  }

  async detectLanguage(): Promise<LanguageAtPath[]> {
    const result: LanguageAtPath[] = [];

    const manifestFilesPromise = this.fileInspector.scanFor(fileNameRegExp('Cargo.toml'), '/').then((arr) =>
      arr.map((file) => {
        return {
          language: ProgrammingLanguage.Rust,
          path: nodePath.dirname(file.path),
        };
      }),
    );

    // * `foo/bar.rs` => `foo/`
    // * `foo/bar/baz.rs, foo/bar/qux.rs` => `foo/bar/`
    // * `foo/bar.rs, `baz/qux.rs` => `.`
    // And specially: `foo/src/foo.rs, foo/src/bar.rs` => `foo/` (skips `src`)
    const rustSourcesPromise = this.fileInspector
      .scanFor(fileExtensionRegExp(['rs']), '/')
      .then((files) => lo.uniq(files.map((f) => nodePath.dirname(f.path))))
      .then((uniqueDirs) => {
        if (uniqueDirs.length === 0) {
          return [];
        }

        let commonPath = sharedSubpath(uniqueDirs);
        if (nodePath.basename(commonPath) === 'src') {
          commonPath = nodePath.dirname(commonPath);
        }

        return [
          {
            language: ProgrammingLanguage.Rust,
            path: commonPath,
          },
        ];
      });

    const manifestFiles = await manifestFilesPromise;
    const rustSources = await rustSourcesPromise;
    // remove from `rustSources` all such paths that already have
    // a `Cargo.toml` anywhere in their ancestor path
    lo.pullAllWith(rustSources, manifestFiles, (source, manifest) => sharedSubpath([manifest.path, source.path]) === manifest.path);

    result.push(...manifestFiles, ...rustSources);

    return result;
  }
}
