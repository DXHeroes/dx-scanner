import { ProjectComponentDetectorFactory, ProjectComponentContextFactory } from '../../types';
import { IProjectComponentDetector } from '../../detectors/IProjectComponentDetector';
import { LanguageAtPath, ProgrammingLanguage, ProjectComponent } from '../../model';
import { ProjectComponentContext } from '../projectComponent/ProjectComponentContext';
import { ContextBase } from '../ContextBase';
import { IInitiable } from '../../lib/IInitable';
export declare class LanguageContext extends ContextBase {
    readonly languageAtPath: LanguageAtPath;
    private projectComponentDetectors;
    private readonly projectComponentDetectorFactory;
    private readonly projecComponentContextFactory;
    private readonly initableInspectors;
    constructor(languageAtPath: LanguageAtPath, projectComponentDetectorFactory: ProjectComponentDetectorFactory, projecComponentContextFactory: ProjectComponentContextFactory, initableInspectors: IInitiable[]);
    init(): Promise<void>;
    get path(): string;
    get language(): ProgrammingLanguage;
    getProjectComponentDetectors(): IProjectComponentDetector[];
    getProjectComponentContext(component: ProjectComponent): ProjectComponentContext;
}
//# sourceMappingURL=LanguageContext.d.ts.map