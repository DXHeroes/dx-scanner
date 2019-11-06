import { blue, bold, Color, green, grey, italic, red, reset, underline, yellow, cyan } from 'colors';
import { injectable } from 'inversify';
import { PracticeImpact, PracticeMetadata, PracticeEvaluationResult } from '../model';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { sharedSubpath } from '../detectors/utils';
import { ReporterUtils } from './ReporterUtils';

@injectable()
export class CLIReporter implements IReporter {
  report(practicesAndComponents: PracticeWithContextForReporter[]): string {
    const lines: string[] = [];

    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);
    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents);

    lines.push(bold(blue('----------------------------')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('|     DX Scanner Result    |')));
    lines.push(bold(blue('|                          |')));

    let repoName;
    const componentsSharedSubpath = sharedSubpath(componentsWithPractices.map((c) => c.component.path));

    for (const cwp of componentsWithPractices) {
      if (cwp.component.repositoryPath) {
        repoName = ReporterUtils.getPathOrRepoUrl(cwp.component.repositoryPath, cwp.component.path.replace(componentsSharedSubpath, ''));
      } else {
        repoName = cwp.component.path;
      }

      lines.push(bold(blue('----------------------------')));
      lines.push('');
      lines.push(bold(blue(`Developer Experience Report for ${italic(repoName)}`)));
      lines.push(cyan(bold(`DX Score: ${dxScore.components.find((c) => c.path === cwp.component.path)!.value}`)));
      lines.push('');

      for (const key in PracticeImpact) {
        const impact = PracticeImpact[key as keyof typeof PracticeImpact];

        const impactLine = this.emitImpactSegment(cwp.practicesAndComponents, impact);
        impactLine && lines.push(impactLine);
      }

      const practicesAndComponentsUnknown = cwp.practicesAndComponents.filter(
        (p) => p.isOn && p.evaluation === PracticeEvaluationResult.unknown,
      );
      if (practicesAndComponentsUnknown.length > 0) {
        lines.push(bold(red('Evaluation of these practices failed:')));
        lines.push('');

        for (const p of practicesAndComponentsUnknown) {
          lines.push(red(`- ${bold(p.practice.name)}`));
        }
        lines.push('');
      }

      const practicesAndComponentsOff = cwp.practicesAndComponents.filter((p) => !p.isOn);
      if (practicesAndComponentsOff.length > 0) {
        lines.push(bold(red('You have turned off these practices:')));
        lines.push('');

        for (const p of practicesAndComponentsOff) {
          lines.push(red(`- ${italic(p.practice.name)}`));
        }
        lines.push('');
      }
    }

    lines.push('----------------------------');
    lines.push('');
    lines.push(bold(cyan(`Your overall score is ${dxScore.value}.`)));
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

    if (practices.length === 0) return undefined;

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
    } else if (impact === PracticeImpact.off) {
      color = grey;
      lines.push(bold(color('These practices are off:\n')));
    } else {
      color = grey;
      lines.push(bold(color('Also consider:')));
    }

    for (const practiceWithContext of practices) {
      lines.push(this.linesForPractice(practiceWithContext.practice, color));

      if (practiceWithContext.practice.defaultImpact !== practiceWithContext.practice.impact) {
        lines.push(bold(this.changedImpact(practiceWithContext.practice, (color = grey))));
      }
    }

    lines.push(bold(''));
    return lines.join('\n');
  }

  private linesForPractice(practice: PracticeMetadata, color: Color): string {
    const findingPath = '';
    const practiceLineTexts = [reset(color(`- ${bold(practice.name)} - ${italic(practice.suggestion)}`))];
    if (practice.url) {
      practiceLineTexts.push(color(`${findingPath}${practice.url}`));
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
