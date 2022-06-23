import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { FixerContext } from '../../contexts/fixer/FixerContext';
import { PracticeConfig } from '../../scanner/IConfigProvider';
import yeoman from 'yeoman-environment';
import { runGenerator } from 'yeoman-gen-run';
import { CliUx } from '@oclif/core';
import { AccessType } from '../../detectors/IScanningStrategy';

const env = yeoman.createEnv(undefined, { console });

env.register(require.resolve('generator-license'), 'license');

interface PracticeOverride extends PracticeConfig {
  override: {
    defaultLicense: string;
  };
}

@DxPractice({
  id: 'LanguageIndependent.LicenseIsPresent',
  name: 'Create a License File',
  impact: PracticeImpact.medium,
  suggestion: 'Add a license to your repository to let others know what they can and can not do with your code.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/license-in-repository',
})
export class LicenseIsPresentPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexLicense = new RegExp('license', 'i');

    const files = await ctx.fileInspector.scanFor(regexLicense, '/', { shallow: true });
    const rootFiles = await ctx.root.fileInspector.scanFor(regexLicense, '/', { shallow: true });
    if (files.length > 0 || rootFiles.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }

  private getDefaultLicense(ctx: FixerContext) {
    if (ctx.config && (ctx.config as PracticeOverride).override?.defaultLicense) {
      return (ctx.config as PracticeOverride).override.defaultLicense;
    } else if (ctx.scanningStrategy?.accessType === AccessType.private) {
      return 'UNLICENSED';
    } else {
      // public or unknown repo
      return 'MIT';
    }
  }

  async fix(ctx: FixerContext) {
    if (ctx.argumentsProvider?.ci) {
      const license = this.getDefaultLicense(ctx);
      await runGenerator('license', {
        answers: { license, options: { nolog: true } },
      });
    } else {
      await CliUx.ux.action.pauseAsync(
        () =>
          new Promise<void>((resolve) => {
            void env.run('license', () => {
              resolve();
            });
          }),
      );
    }
  }
}
