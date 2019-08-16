import { Color, blue, bold, green, grey, italic, red, reset, yellow } from 'colors';
import { PracticeAndComponent, PracticeImpact } from '../model';
import { GitHubUrlParser } from '../services/git/GitHubUrlParser';
import { IReporter } from './IReporter';
import { injectable } from 'inversify';
import { uniq, compact } from 'lodash';

@injectable()
export class CLIReporter implements IReporter {
  report(practicesAndComponents: PracticeAndComponent[]): string {
    const lines: string[] = [];

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

    lines.push(bold(blue('----------------------------')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('|     DX Scanner Result    |')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('----------------------------')));

    lines.push(bold(blue('Developer Experience Report for:')));
    repoNames.forEach((repoName) => {
      lines.push(repoName);
    });

    lines.push('\n----------------------------');
    for (const key in PracticeImpact) {
      const impact = <PracticeImpact>PracticeImpact[key];

      const impactLine = this.emitImpactSegment(practicesAndComponents, impact);
      impactLine && lines.push(impactLine);
    }
    lines.push('');
    lines.push('----------------------------');
    lines.push('');
    lines.push(italic(blue('Implementation is not adoption.')));
    lines.push(italic(blue('We can help you with both. :-)')));
    lines.push(italic(blue('- https://dxheroes.io')));
    lines.push(reset(' '));
    return lines.join('\n');
  }

  private emitImpactSegment(practicesAndComponents: PracticeAndComponent[], impact: PracticeImpact): string | undefined {
    const lines: string[] = [];
    practicesAndComponents = practicesAndComponents.filter((pac) => pac.practice.impact === impact);
    if (practicesAndComponents.length === 0) {
      return undefined;
    }
    lines.push(reset(''));
    let color = blue;
    if (impact === PracticeImpact.high) {
      color = red;
      lines.push(bold(color('Improvements with highest impact:\n')));
    } else if (impact === PracticeImpact.medium) {
      color = yellow;
      lines.push(bold(color('Improvements with medium impact:\n')));
    } else if (impact === PracticeImpact.small) {
      color = green;
      lines.push(bold(color('Improvements with minor impact:\n')));
    } else {
      color = grey;
      lines.push(bold(color('Also consider:')));
    }
    for (const pac of practicesAndComponents) {
      lines.push(this.linesForPractice(pac, color, practicesAndComponents.length > 1));
    }
    lines.push(bold(''));
    return lines.join('\n');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private linesForPractice(pac: PracticeAndComponent, color: Color, _includeFindingPath: boolean): string {
    const findingPath = '';
    // if (includeFindingPath) {
    //     const ownerAndRepo = GitHubUrlParser.getOwnerAndRepoName(pac.component.githubUrl!);
    //     findingPath = `at: ${ownerAndRepo.owner}/${ownerAndRepo.repoName}`;
    // }

    const practiceLineTexts = [reset(color(`- ${bold(pac.practice.name)} - ${italic(pac.practice.suggestion)}`))];
    if (pac.practice.url) {
      practiceLineTexts.push(color(italic(`${findingPath}(${pac.practice.url})`)));
    }

    return practiceLineTexts.join(' ');
  }
}
