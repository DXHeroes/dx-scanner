import { LanguageContextFactory } from '../../types';
import { ILanguageDetector } from '../../detectors/ILanguageDetector';
import { LanguageAtPath } from '../../model';
import { ContextBase } from '../ContextBase';
import { IReporter } from '../../reporters';
export declare class ScannerContext extends ContextBase {
    readonly languageDetectors: ILanguageDetector[];
    readonly reporters: IReporter[];
    private readonly languageContextFactory;
    constructor(languageDetectors: ILanguageDetector[], reporters: IReporter[], languageContextFactory: LanguageContextFactory);
    init(): Promise<void>;
    getLanguageContext(languageAtPath: LanguageAtPath): import("../language/LanguageContext").LanguageContext;
}
//# sourceMappingURL=ScannerContext.d.ts.map