import { PackageInspectorBase } from './PackageInspectorBase';

export class PythonPackageInspector extends PackageInspectorBase {
  init(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  hasLockfile(): boolean | undefined {
    throw new Error('Method not implemented.');
  }
}
