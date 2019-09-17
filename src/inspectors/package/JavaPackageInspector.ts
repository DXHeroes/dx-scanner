import { PackageInspectorBase } from './PackageInspectorBase';

export class JavaPackageInspector extends PackageInspectorBase {
  async init(): Promise<void> {
    //throw new Error('Method not implemented.');
    return;
  }

  hasLockfile(): boolean {
    return false;
  }
}
