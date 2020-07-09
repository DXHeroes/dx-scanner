import { parseNpmAudit, parseYarnAudit } from './PracticeUtils';
import { ShellString } from 'shelljs';
import { npmShellResponse, yarnShellResponse } from '../reporters/__MOCKS__/auditResponse.mock';

describe('PracticeUtils', () => {
  describe('parseNpmAudit', () => {
    it('All properties should be defined', async () => {
      const result = await parseNpmAudit(npmShellResponse as ShellString);
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
      await expect(parseNpmAudit(({ stdout: detail } as unknown) as ShellString)).rejects.toThrowError(
        'Failed to parse package.json data.\n' + 'package.json must be actual JSON, not just JavaScript.',
      );
    });
  });

  describe('parseYarnAudit', () => {
    it('All properties should be defined', async () => {
      const result = await parseYarnAudit(yarnShellResponse as ShellString);
      const isEmpty = !Object.values(result).some((x) => x !== null && x !== undefined);
      expect(isEmpty).toBe(false);
    });
  });
});
