import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { IPractice } from '../IPractice';
import shell from 'shelljs';
import debug from 'debug';

enum PackageManagerType {
  unknown = 'unknown',
  npm = 'npm',
  yarn = 'yarn',
}

@DxPractice({
  id: 'JavaScript.SecurityVulnerabilities',
  name: 'Security vulnerabilities detected',
  impact: PracticeImpact.high,
  suggestion: 'Some high-severity security vulnerabilities were detected. Use npm/yarn audit or Snyk to fix them.',
  reportOnlyOnce: true,
  url: 'https://snyk.io/',
})
export class SecurityVulnerabilitiesPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.JavaScript || ctx.projectComponent.language === ProgrammingLanguage.TypeScript
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const npmCmd = 'npm audit --audit-level=high';
    const yarnCmd = 'yarn audit --summary';
    const getPackageManager = async () => {
      const packageLockExists = await ctx.fileInspector?.exists('package-lock.json');
      if (packageLockExists) return PackageManagerType.npm;
      const shrinkwrapExists = await ctx.fileInspector?.exists('./npm-shrinkwrap.json');
      if (shrinkwrapExists) return PackageManagerType.npm;
      const yarnLockExists = await ctx.fileInspector?.exists('./yarn.lock');
      if (yarnLockExists) return PackageManagerType.yarn;
      return PackageManagerType.unknown;
    };

    const packageManager = await getPackageManager();
    if (packageManager === PackageManagerType.unknown) {
      const securityVulnerabilitiesPracticeDebug = debug('SecurityVulnerabilitiesPractice');
      securityVulnerabilitiesPracticeDebug('Cannot establish package-manager type, missing package-lock.json and yarn.lock.');
      return PracticeEvaluationResult.unknown;
    }
    const currentDir = shell.pwd();
    shell.cd(ctx.fileInspector?.basePath);
    const result = shell.exec(packageManager === PackageManagerType.npm ? npmCmd : yarnCmd, { silent: true });
    shell.cd(currentDir);
    if (packageManager === PackageManagerType.npm && result.code > 0) return PracticeEvaluationResult.notPracticing;
    if (result.code > 7) return PracticeEvaluationResult.notPracticing; // only other option is Yarn
    return PracticeEvaluationResult.practicing;
  }
}
