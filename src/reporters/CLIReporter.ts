import { blue, bold, Color, green, grey, italic, red, reset, underline, yellow } from 'colors';
import { inject, injectable } from 'inversify';
import { PracticeImpact, PracticeMetadata, PracticeEvaluationResult } from '../model';
import { Types } from '../types';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { JSONReporter } from './JSONReporter';
import { sharedSubpath } from '../detectors/utils';
import { GitServiceUtils } from '../services/git/GitServiceUtils';
import { ReporterUtils } from './ReporterUtils';

@injectable()
export class CLIReporter implements IReporter {
  private readonly JSONReporter: JSONReporter;

  constructor(@inject(Types.JSONReporter) JSONReporter: JSONReporter) {
    this.JSONReporter = JSONReporter;
  }

  report(practicesAndComponents: PracticeWithContextForReporter[]): string {
    const lines: string[] = [];

    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);

    lines.push(bold(blue('----------------------------')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('|     DX Scanner Result    |')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('----------------------------')));

    let repoName;
    const componentsSharedSubpath = sharedSubpath(componentsWithPractices.map((c) => c.component.path));

    for (const cwp of componentsWithPractices) {
      lines.push('');
      lines.push(bold(blue('Developer Experience Report for:')));

      if (cwp.component.repositoryPath) {
        repoName = GitServiceUtils.getUrlToRepo(cwp.component.repositoryPath, cwp.component.path.replace(componentsSharedSubpath, ''));
      } else {
        repoName = cwp.component.path;
      }
      lines.push(repoName);
      lines.push('----------------------------');

      for (const key in PracticeImpact) {
        const impact = PracticeImpact[key as keyof typeof PracticeImpact];

        const impactLine = this.emitImpactSegment(cwp.practicesAndComponents, impact);
        impactLine && lines.push(impactLine);
      }

      lines.push('----------------------------');
      lines.push('');

      const practicesAndComponentsOff = practicesAndComponents.filter((p) => p.isOn === false);
      practicesAndComponentsOff.length === 0
        ? lines.push(bold(yellow('No practices were switched off.')))
        : lines.push(bold(red('You switched off these practices:')));
      for (const p of practicesAndComponentsOff) {
        lines.push(red(`- ${italic(p.practice.name)}`));
      }
    }

    lines.push('----------------------------');
    lines.push('');
    lines.push(italic(blue('Implementation is not adoption.')));
    lines.push(italic(blue('We can help you with both. :-)')));
    lines.push(italic(blue('- https://dxheroes.io')));
    lines.push(reset(' '));
    return lines.join('\n');
  }

  private emitImpactSegment(practicesAndComponents: PracticeWithContextForReporter[], impact: PracticeImpact): string | undefined {
    const lines: string[] = [];

    const practices = practicesAndComponents.filter(
      (p) => p.impact === impact && p.isOn === true && p.evaluation === PracticeEvaluationResult.notPracticing,
    );
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

    for (const practiceWithContext of practices) {
      lines.push(this.linesForPractice(practiceWithContext.practice, color));

      if (practiceWithContext.practice.defaultImpact !== practiceWithContext.impact) {
        lines.push(bold(this.changedImpact(practiceWithContext.practice, (color = grey))));
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
