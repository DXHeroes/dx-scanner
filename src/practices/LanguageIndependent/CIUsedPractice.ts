import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import _ from 'lodash';
import { Metadata } from '../../services/model';

@DxPractice({
  id: 'LanguageIndependent.CIUsedPractice',
  name: 'Use Continuous Integration',
  impact: PracticeImpact.high,
  suggestion:
    'Continuous Integration (CI) is a practice of daily integrating code changes. Use CI to reduce the integration risk, improve code quality, and more.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/continuous-integration',
})
export class CIUsedPractice implements IPractice {
  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const filesInRootRegex = new RegExp(/\.gitlab\-ci\.yml|\.travis\.yml|\.jenkins\.yml|appveyor\.yml|azure\-pipelines\.yml/, 'i');
    const filesInFoldersToSearch: { fileName: string; path: string }[] = [{ fileName: 'config.yml', path: '.circleci' }];

    const filesInRoot = await ctx.root.fileInspector.scanFor(filesInRootRegex, '/', { shallow: true, ignoreErrors: true });
    let filesInFolders: Metadata[] = [];

    // search for config files in subfolders in a root of component
    if (filesInRoot.length === 0) {
      const foundFilesInFolders = await Promise.all(
        filesInFoldersToSearch.map((fif) => {
          return ctx.root.fileInspector!.scanFor(fif.fileName, fif.path, { shallow: true, ignoreErrors: true });
        }),
      );
      filesInFolders = _.flatten(foundFilesInFolders);
    }

    if (filesInRoot.length > 0 || filesInFolders.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
