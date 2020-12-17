import { ILanguageDetector } from '../ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
export declare class RubyLanguageDetector implements ILanguageDetector {
    private fileInspector;
    constructor(fileInspector: IFileInspector);
    detectLanguage(): Promise<LanguageAtPath[]>;
}
//# sourceMappingURL=RubyLanguageDetector.d.ts.map