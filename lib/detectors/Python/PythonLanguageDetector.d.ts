import { ILanguageDetector } from '../ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
export declare class PythonLanguageDetector implements ILanguageDetector {
    private fileInspector;
    constructor(fileInspector: IFileInspector);
    detectLanguage(): Promise<LanguageAtPath[]>;
}
//# sourceMappingURL=PythonLanguageDetector.d.ts.map