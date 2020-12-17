import { ILanguageDetector } from '../ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
export declare class JavaScriptLanguageDetector implements ILanguageDetector {
    private fileInspector;
    constructor(fileInspector: IFileInspector);
    detectLanguage(): Promise<LanguageAtPath[]>;
}
//# sourceMappingURL=JavaScriptLanguageDetector.d.ts.map