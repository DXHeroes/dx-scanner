import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { ProjectComponent, LanguageAtPath } from '../../model';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
export declare class RubyComponentDetector implements IProjectComponentDetector {
    private packageInspector;
    constructor(packageInspector: IPackageInspector);
    detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]>;
}
//# sourceMappingURL=RubyComponentDetector.d.ts.map