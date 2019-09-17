import { PackageInspectorBase } from './PackageInspectorBase';

export class JavaPackageInspector extends PackageInspectorBase {
  async init(): Promise<void> {
    return;
  }

  hasLockfile(): boolean {
    return false;
  }
}
