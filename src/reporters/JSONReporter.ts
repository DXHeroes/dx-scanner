import { PracticeAndComponent, PracticeImpact } from '../model';
import { GitHubUrlParser } from '../services/git/GitHubUrlParser';
import { IReporter, PracticeInfo } from './IReporter';
import { injectable } from 'inversify';
import { uniq, compact } from 'lodash';

@injectable()
export class JSONReporter implements IReporter {
  report(practicesAndComponents: PracticeAndComponent[]): string {
    const repoNames = uniq(
      compact(
        practicesAndComponents.map((pac): string | undefined => {
          if (pac.component.repositoryPath) {
            const git = GitHubUrlParser.getOwnerAndRepoName(pac.component.repositoryPath);
            return `${git.owner}/${git.repoName}`;
          }

          return pac.component.path;
        }),
      ),
    );

    let practices: PracticeInfo;

    for (const pac of practicesAndComponents) {
      practices = {
        name: pac.practice.name,
        suggestion: pac.practice.suggestion,
        impact: pac.practice.impact,
        url: pac.practice.url,
      };
    }

    return JSON.stringify(practices);
  }
}
