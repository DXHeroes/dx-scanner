import { DependenciesVersionEvaluationUtils } from './DependenciesVersionEvaluationUtils';
import { SemverLevel } from '../../inspectors/package/PackageInspectorBase';
import { DependencyType } from '../../inspectors/IPackageInspector';

describe('DependenciesVersionEvaluationUtils', () => {
  const oldPackages = [
    {
      name: 'fake',
      requestedVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
      lockfileVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
      dependencyType: DependencyType.Dev,
    },
    {
      name: 'dummy',
      requestedVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
      lockfileVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
      dependencyType: DependencyType.Dev,
    },
  ];

  it('Detects change in major level', () => {
    const newVersions = { fake: '2.0.0', dummy: '1.0.0' };
    const toUpdate = DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, SemverLevel.major, oldPackages);
    const toUpdateNames = toUpdate.map((p) => p.name);

    expect(toUpdateNames).toEqual(['fake']);
  });

  it('Detects change in minor level', () => {
    const newVersions = { fake: '1.2.0', dummy: '1.0.0' };
    const toUpdate = DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, SemverLevel.minor, oldPackages);
    const toUpdateNames = toUpdate.map((p) => p.name);

    expect(toUpdateNames).toEqual(['fake']);
  });

  it('Detects change in patch level', () => {
    const newVersions = { fake: '1.0.2', dummy: '1.0.0' };
    const toUpdate = DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, SemverLevel.patch, oldPackages);
    const toUpdateNames = toUpdate.map((p) => p.name);

    expect(toUpdateNames).toEqual(['fake']);
  });

  it('Does not detect major update as minor level update', () => {
    const newVersions = { fake: '2.4.6', dummy: '1.0.0' };
    const toUpdate = DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, SemverLevel.minor, oldPackages);
    const toUpdateNames = toUpdate.map((p) => p.name);

    expect(toUpdateNames).toEqual([]);
  });

  it('Does not detect major update as patch level update', () => {
    const newVersions = { fake: '2.4.6', dummy: '1.0.0' };
    const toUpdate = DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, SemverLevel.patch, oldPackages);
    const toUpdateNames = toUpdate.map((p) => p.name);

    expect(toUpdateNames).toEqual([]);
  });
});
