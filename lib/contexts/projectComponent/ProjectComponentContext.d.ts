import { PracticeContextFactory } from '../../types';
import { ProgrammingLanguage, ProjectComponent } from '../../model';
import { PracticeContext } from '../practice/PracticeContext';
import { ConfigProvider } from '../../scanner/ConfigProvider';
export declare class ProjectComponentContext {
    readonly projectComponent: ProjectComponent;
    private readonly practiceContextFactory;
    readonly configProvider: ConfigProvider;
    constructor(configProvider: ConfigProvider, projectComponent: ProjectComponent, practiceContextFactory: PracticeContextFactory);
    get path(): string;
    get language(): ProgrammingLanguage;
    getPracticeContext(): PracticeContext;
}
//# sourceMappingURL=ProjectComponentContext.d.ts.map