"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNpmAudit = exports.parseYarnAudit = void 0;
exports.parseYarnAudit = async (result) => {
    // cmd yarn audit --json uses json lines
    const arrayOfJSON = result.split('\n');
    const vulnerabilities = [];
    let summary;
    arrayOfJSON.forEach((json) => {
        var _a, _b, _c, _d, _e, _f;
        if (json !== '') {
            const element = JSON.parse(json);
            if ((_a = element === null || element === void 0 ? void 0 : element.data) === null || _a === void 0 ? void 0 : _a.advisory) {
                // https://github.com/yarnpkg/yarn/blob/158da6c6287cbc4fee900e3704f140c3391dc28d/src/reporters/console/console-reporter.js
                const path = (_c = (_b = element.data.resolution) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c.split('>').join(' > ');
                const dependencyOf = (_f = (_e = (_d = element === null || element === void 0 ? void 0 : element.data) === null || _d === void 0 ? void 0 : _d.resolution) === null || _e === void 0 ? void 0 : _e.path) === null || _f === void 0 ? void 0 : _f.split('>')[0];
                const patchedIn = element.data.advisory.patched_versions.replace(' ', '') === '<0.0.0'
                    ? 'No patch available'
                    : element.data.advisory.patched_versions;
                const vulnerability = {
                    library: element.data.advisory.module_name,
                    type: element.data.advisory.title,
                    severity: element.data.advisory.severity,
                    dependencyOf,
                    path,
                    patchedIn,
                    vulnerableVersions: element.data.advisory.vulnerable_versions,
                };
                vulnerabilities.push(vulnerability);
            }
            if (element.type === 'auditSummary') {
                summary = {
                    info: element.data.vulnerabilities.info,
                    low: element.data.vulnerabilities.low,
                    moderate: element.data.vulnerabilities.moderate,
                    high: element.data.vulnerabilities.high,
                    critical: element.data.vulnerabilities.critical,
                    code: result.code,
                };
            }
        }
    });
    return { vulnerabilities, summary };
};
exports.parseNpmAudit = async (result) => {
    const vulnerabilities = [];
    let summary;
    const data = JSON.parse(result.stdout);
    if (data.error) {
        throw new Error(data.error.detail);
    }
    //https://github.com/npm/npm-audit-report/blob/v1.3.3/reporters/detail.js
    if (Object.keys(data.advisories).length !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.actions.forEach((action) => {
            action.resolves.forEach((resolution) => {
                const advisory = data.advisories[resolution.id];
                const vulnerability = {
                    library: advisory.module_name,
                    type: advisory.title,
                    severity: advisory.severity,
                    vulnerableVersions: advisory.vulnerable_versions,
                    patchedIn: advisory.patched_versions,
                    dependencyOf: resolution.path.split('>')[0],
                    path: resolution.path.split('>').join(' > '),
                };
                vulnerabilities.push(vulnerability);
            });
        });
        if (data.metadata) {
            summary = {
                info: data.metadata.vulnerabilities.info,
                low: data.metadata.vulnerabilities.low,
                moderate: data.metadata.vulnerabilities.moderate,
                high: data.metadata.vulnerabilities.high,
                critical: data.metadata.vulnerabilities.critical,
                code: result.code,
            };
        }
    }
    return { vulnerabilities, summary };
};
//# sourceMappingURL=PracticeUtils.js.map