import { ILanguageDetector } from '../ILanguageDetector';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { LanguageAtPath } from '../../model';
export declare class JavaLanguageDetector implements ILanguageDetector {
    private fileInspector;
    constructor(fileInspector: IFileInspector);
    detectLanguage(): Promise<LanguageAtPath[]>;
}
//# sourceMappingURL=JavaLanguageDetector.d.ts.map