import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { LanguageAtPath, ProjectComponent } from '../../model';
export declare class PythonComponentDetector implements IProjectComponentDetector {
    private packageInspector;
    constructor(packageInspector: IPackageInspector);
    detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]>;
}
//# sourceMappingURL=PythonComponentDetector.d.ts.map