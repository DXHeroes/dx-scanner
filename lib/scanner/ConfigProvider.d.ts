import { IFileInspector } from '../inspectors/IFileInspector';
import { IConfigProvider, Config, PracticeConfig } from './IConfigProvider';
export declare class ConfigProvider implements IConfigProvider {
    private readonly fileInspector;
    config: Config | undefined;
    constructor(fileInspector: IFileInspector);
    init(): Promise<undefined>;
    getOverriddenPractice(practiceId: string): PracticeConfig | undefined;
}
//# sourceMappingURL=ConfigProvider.d.ts.map