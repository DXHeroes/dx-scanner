import { blue, bold, Color, green, grey, italic, red, reset, underline, yellow } from 'colors';
import { inject, injectable } from 'inversify';
import { PracticeAndComponent, PracticeImpact, PracticeMetadata } from '../model';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { Types } from '../types';
import { ComponentReport, IReporter } from './IReporter';
import { JSONReporter } from './JSONReporter';
import { sharedSubpath } from '../detectors/utils';
import { GitServiceUtils } from '../services/git/GitServiceUtils';

@injectable()
export class CLIReporter implements IReporter {
  private readonly JSONReporter: JSONReporter;

  constructor(@inject(Types.JSONReporter) JSONReporter: JSONReporter) {
    this.JSONReporter = JSONReporter;
  }

  report(practicesAndComponents: PracticeAndComponent[], practicesOff: IPracticeWithMetadata[]): string {
    const lines: string[] = [];

    const report = this.JSONReporter.report(practicesAndComponents, practicesOff);

    lines.push(bold(blue('----------------------------')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('|     DX Scanner Result    |')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('----------------------------')));

    let repoName;
    const componentsSharedSubpath = sharedSubpath(report.components.map((c) => c.path));

    for (const component of report.components) {
      lines.push('');
      lines.push(bold(blue('Developer Experience Report for:')));

      if (component.repositoryPath) {
        repoName = GitServiceUtils.getUrlToRepo(component.repositoryPath, component.path.replace(componentsSharedSubpath, ''));
      } else {
        repoName = component.path;
      }
      lines.push(repoName);
      lines.push('----------------------------');

      for (const key in PracticeImpact) {
        const impact = <PracticeImpact>PracticeImpact[key];

        const impactLine = this.emitImpactSegment(component, impact);
        impactLine && lines.push(impactLine);
      }
    }

    practicesOff.length === 0
      ? lines.push(bold(yellow('No practices were switched off.')))
      : lines.push(bold(red('You switched off these practices:')));
    for (const practice of practicesOff) {
      lines.push(red(`- ${italic(practice.getMetadata().name)}`));
    }

    lines.push('----------------------------');
    lines.push('');
    lines.push(italic(blue('Implementation is not adoption.')));
    lines.push(italic(blue('We can help you with both. :-)')));
    lines.push(italic(blue('- https://dxheroes.io')));
    lines.push(reset(' '));
    return lines.join('\n');
  }

  private emitImpactSegment(component: ComponentReport, impact: PracticeImpact): string | undefined {
    const lines: string[] = [];

    const practices = component.practices.filter((practice) => practice.impact === impact);
    if (practices.length === 0) {
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

    for (const practice of practices) {
      lines.push(this.linesForPractice(practice, color));

      if (practice.defaultImpact !== practice.impact) {
        lines.push(bold(this.changedImpact(practice, (color = grey))));
      }
    }

    lines.push(bold(''));
    return lines.join('\n');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private linesForPractice(practice: PracticeMetadata, color: Color): string {
    const findingPath = '';
    const practiceLineTexts = [reset(color(`- ${bold(practice.name)} - ${italic(practice.suggestion)}`))];
    if (practice.url) {
      practiceLineTexts.push(color(italic(`${findingPath}(${practice.url})`)));
    }

    return practiceLineTexts.join(' ');
  }

  private changedImpact(practice: PracticeMetadata, color: Color) {
    const practiceLineTexts = [
      reset(
        color(
          `You changed impact of ${bold(practice.name)} from ${underline(<string>practice.defaultImpact)} to ${underline(practice.impact)}`,
        ),
      ),
    ];
    return practiceLineTexts.join(' ');
  }
}
