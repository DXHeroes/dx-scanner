"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependenciesVersionEvaluationUtils = void 0;
const inspectors_1 = require("../../inspectors");
const DashboardReporter_1 = require("../../reporters/DashboardReporter");
class DependenciesVersionEvaluationUtils {
    static packagesToBeUpdated(pkgsWithNewVersion, semverLevel, pkgs) {
        const pkgsToUpdate = [];
        for (const packageName in pkgsWithNewVersion) {
            const parsedVersion = inspectors_1.PackageInspectorBase.semverToPackageVersion(pkgsWithNewVersion[packageName]);
            if (parsedVersion) {
                for (const pkg of pkgs) {
                    if (pkg.name === packageName && parsedVersion[semverLevel] > pkg.lockfileVersion[semverLevel]) {
                        switch (semverLevel) {
                            case inspectors_1.SemverLevel.patch:
                                if (parsedVersion[inspectors_1.SemverLevel.minor] === pkg.lockfileVersion[inspectors_1.SemverLevel.minor] &&
                                    parsedVersion[inspectors_1.SemverLevel.major] === pkg.lockfileVersion[inspectors_1.SemverLevel.major]) {
                                    pkgsToUpdate.push({
                                        library: pkg.name,
                                        newestVersion: parsedVersion.value,
                                        currentVersion: pkg.lockfileVersion.value,
                                        severity: DashboardReporter_1.UpdatedDependencySeverity.High,
                                    });
                                }
                                break;
                            case inspectors_1.SemverLevel.minor:
                                if (parsedVersion[inspectors_1.SemverLevel.major] === pkg.lockfileVersion[inspectors_1.SemverLevel.major]) {
                                    pkgsToUpdate.push({
                                        library: pkg.name,
                                        newestVersion: parsedVersion.value,
                                        currentVersion: pkg.lockfileVersion.value,
                                        severity: DashboardReporter_1.UpdatedDependencySeverity.Moderate,
                                    });
                                }
                                break;
                            case inspectors_1.SemverLevel.major:
                                pkgsToUpdate.push({
                                    library: pkg.name,
                                    newestVersion: parsedVersion.value,
                                    currentVersion: pkg.lockfileVersion.value,
                                    severity: DashboardReporter_1.UpdatedDependencySeverity.Low,
                                });
                                break;
                        }
                    }
                }
            }
        }
        return pkgsToUpdate;
    }
}
exports.DependenciesVersionEvaluationUtils = DependenciesVersionEvaluationUtils;
//# sourceMappingURL=DependenciesVersionEvaluationUtils.js.map