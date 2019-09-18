import { IProjectComponentDetector } from '../IProjectComponentDetector';
import { injectable, inject } from 'inversify';
import { Types } from '../../types';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { LanguageAtPath, ProjectComponent } from '../../model';

@injectable()
export class JavaComponentDetector implements IProjectComponentDetector {
  private packageInspector: IPackageInspector;
  constructor(
    @inject(Types.IPackageInspector)
    packageInspector: IPackageInspector,
  ) {
    this.packageInspector = packageInspector;
  }

  async detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]> {
    return [];
  }
}
