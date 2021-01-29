"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DependenciesVersionEvaluationUtils_1 = require("./DependenciesVersionEvaluationUtils");
const PackageInspectorBase_1 = require("../../inspectors/package/PackageInspectorBase");
const IPackageInspector_1 = require("../../inspectors/IPackageInspector");
describe('DependenciesVersionEvaluationUtils', () => {
    const oldPackages = [
        {
            name: 'fake',
            requestedVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
            lockfileVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
            dependencyType: IPackageInspector_1.DependencyType.Dev,
        },
        {
            name: 'dummy',
            requestedVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
            lockfileVersion: { value: '1.0.0', major: '1', minor: '0', patch: '0' },
            dependencyType: IPackageInspector_1.DependencyType.Dev,
        },
    ];
    it('Detects change in major level', () => {
        const newVersions = { fake: '2.0.0', dummy: '1.0.0' };
        const toUpdate = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, PackageInspectorBase_1.SemverLevel.major, oldPackages);
        const toUpdateNames = toUpdate.map((p) => p.library);
        expect(toUpdateNames).toEqual(['fake']);
    });
    it('Detects change in minor level', () => {
        const newVersions = { fake: '1.2.0', dummy: '1.0.0' };
        const toUpdate = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, PackageInspectorBase_1.SemverLevel.minor, oldPackages);
        const toUpdateNames = toUpdate.map((p) => p.library);
        expect(toUpdateNames).toEqual(['fake']);
    });
    it('Detects change in patch level', () => {
        const newVersions = { fake: '1.0.2', dummy: '1.0.0' };
        const toUpdate = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, PackageInspectorBase_1.SemverLevel.patch, oldPackages);
        const toUpdateNames = toUpdate.map((p) => p.library);
        expect(toUpdateNames).toEqual(['fake']);
    });
    it('Does not detect major update as minor level update', () => {
        const newVersions = { fake: '2.4.6', dummy: '1.0.0' };
        const toUpdate = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, PackageInspectorBase_1.SemverLevel.minor, oldPackages);
        const toUpdateNames = toUpdate.map((p) => p.library);
        expect(toUpdateNames).toEqual([]);
    });
    it('Does not detect major update as patch level update', () => {
        const newVersions = { fake: '2.4.6', dummy: '1.0.0' };
        const toUpdate = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(newVersions, PackageInspectorBase_1.SemverLevel.patch, oldPackages);
        const toUpdateNames = toUpdate.map((p) => p.library);
        expect(toUpdateNames).toEqual([]);
    });
});
//# sourceMappingURL=DependenciesVersionEvaluationUtils.spec.js.map