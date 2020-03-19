import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PackageManagerUtils, PackageManagerType } from '../utils/PackageManagerUtils';
import { sync as commandExistsSync } from 'command-exists';
import shell from 'shelljs';

@DxPractice({
  id: 'LanguageIndependent.LockfileIsPresent',
  name: 'Create a Lockfile',
  impact: PracticeImpact.high,
  suggestion: 'Commit a lockfile to git to have a reliable assembly across environments',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/lockfile',
})
export class LockfileIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexLockFile = new RegExp('lock', 'i');

    const files = await ctx.fileInspector.scanFor(regexLockFile, '/', { shallow: true });
    if (files.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }

  async fix() {
    const generateYarnLock = () => {
      shell.exec('yarn install');
    };
    const generateNpmLock = () => {
      shell.exec('npm i --package-lock-only');
    };
    let packageManager = await PackageManagerUtils.getPmInstalled();
    if (packageManager === PackageManagerType.unknown) {
      // prefer yarn
      const hasYarn = commandExistsSync('yarn');
      const hasNpm = commandExistsSync('npm');
      if (hasYarn) {
        packageManager = PackageManagerType.yarn;
      } else if (hasNpm) {
        packageManager = PackageManagerType.npm;
      } else {
        return;
      }
    }
    if (packageManager === PackageManagerType.yarn) return generateYarnLock();
    if (packageManager === PackageManagerType.npm) return generateNpmLock();
  }
}
