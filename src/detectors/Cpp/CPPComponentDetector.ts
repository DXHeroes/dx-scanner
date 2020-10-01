import { injectable, inject } from 'inversify';
import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { ProjectComponent, LanguageAtPath, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from '../../model';
import { Types } from '../../types';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
@injectable()
export class CppComponentDetector implements IProjectComponentDetector {
    private packageInspector: IPackageInspector;
    constructor(
        @inject(Types.IPackageInspector)
        packageInspector: IPackageInspector,
    ) {
        this.packageInspector = packageInspector;
    }
    async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
        return [
            {
                framework: ProjectComponentFramework.UNKNOWN,
                language: langAtPath.language,
                path: langAtPath.path,
                platform: ProjectComponentPlatform.BackEnd,
                repositoryPath: undefined,
                type: ProjectComponentType.Application,
            },
        ];
    }
}

