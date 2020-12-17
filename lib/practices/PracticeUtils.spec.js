"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PracticeUtils_1 = require("./PracticeUtils");
const auditResponse_mock_1 = require("../reporters/__MOCKS__/auditResponse.mock");
describe('PracticeUtils', () => {
    describe('parseNpmAudit', () => {
        it('All properties should be defined', async () => {
            const result = await PracticeUtils_1.parseNpmAudit(auditResponse_mock_1.npmShellResponse);
            const isEmpty = !Object.values(result).some((x) => x !== null && x !== undefined);
            expect(isEmpty).toBe(false);
            expect(result).toEqual({
                vulnerabilities: [
                    {
                        library: 'lodash',
                        type: 'Prototype Pollution',
                        severity: 'low',
                        vulnerableVersions: '>=0.0.0',
                        patchedIn: '<0.0.0',
                        dependencyOf: 'yeoman-gen-run',
                        path: 'yeoman-gen-run > yeoman-environment > lodash',
                    },
                ],
                summary: {
                    info: 0,
                    low: 32,
                    moderate: 0,
                    high: 0,
                    critical: 0,
                    code: 1,
                },
            });
        });
        it('All properties should be defined', async () => {
            const detail = JSON.stringify({
                error: {
                    detail: 'Failed to parse package.json data.\n' + 'package.json must be actual JSON, not just JavaScript.',
                },
            });
            await expect(PracticeUtils_1.parseNpmAudit({ stdout: detail })).rejects.toThrowError('Failed to parse package.json data.\n' + 'package.json must be actual JSON, not just JavaScript.');
        });
    });
    describe('parseYarnAudit', () => {
        it('All properties should be defined', async () => {
            const result = await PracticeUtils_1.parseYarnAudit(auditResponse_mock_1.yarnShellResponse);
            const isEmpty = !Object.values(result).some((x) => x !== null && x !== undefined);
            expect(isEmpty).toBe(false);
        });
    });
});
//# sourceMappingURL=PracticeUtils.spec.js.map