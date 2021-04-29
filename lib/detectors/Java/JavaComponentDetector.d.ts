import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { LanguageAtPath, ProjectComponent } from '../../model';
import { IFileInspector } from '../../inspectors';
export declare class JavaComponentDetector implements IProjectComponentDetector {
    private packageInspector;
    private fileInspector;
    constructor(packageInspector: IPackageInspector, fileInspector: IFileInspector);
    detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]>;
}
//# sourceMappingURL=JavaComponentDetector.d.ts.map