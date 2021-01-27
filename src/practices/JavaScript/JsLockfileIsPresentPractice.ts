import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PackageManagerUtils, PackageManagerType } from '../utils/PackageManagerUtils';
import shell from 'shelljs';

@DxPractice({
  id: 'LanguageIndependent.LockfileIsPresent',
  name: 'Create a Lockfile',
  impact: PracticeImpact.high,
  suggestion: 'Commit a lockfile to git to have a reliable assembly across environments',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/lockfile',
})
export class JsLockfileIsPresentPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
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
    const packageManager = PackageManagerUtils.packageManagerInstalled(PackageManagerType.yarn); // prefer Yarn
    if (packageManager === PackageManagerType.yarn) return generateYarnLock();
    if (packageManager === PackageManagerType.npm) return generateNpmLock();
  }
}
