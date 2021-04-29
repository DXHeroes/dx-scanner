import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { LanguageAtPath, ProjectComponent } from '../../model';
import { IFileInspector, RustPackageInspector } from '../../inspectors';
export declare class RustComponentDetector implements IProjectComponentDetector {
    private readonly packageInspector;
    private readonly fileInspector;
    constructor(packageInspector: RustPackageInspector, fileInspector: IFileInspector);
    detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]>;
}
//# sourceMappingURL=RustComponentDetector.d.ts.map