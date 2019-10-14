import { DependencyType, Package } from '../../src/inspectors/IPackageInspector';

export const mockPackage = (name: string, value = '1.0.0', dependencyType: DependencyType = DependencyType.Runtime): Package => {
  const values = value.split('.');
  const major = values[0];
  const minor = values[1] || '0';
  const patch = values[2] || '0';

  const ctx = {
    name: name,
    requestedVersion: {
      value: value,
      major: major,
      minor: minor,
      patch: patch,
    },
    lockfileVersion: {
      value: value,
      major: major,
      minor: minor,
      patch: patch,
    },
    dependencyType: dependencyType,
  };

  return ctx;
};
