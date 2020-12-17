import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { LanguageAtPath, ProjectComponent } from '../../model';
export declare class GoComponentDetector implements IProjectComponentDetector {
    private packageInspector;
    constructor(packageInspector: IPackageInspector);
    detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]>;
}
//# sourceMappingURL=GoComponentDetector.d.ts.map