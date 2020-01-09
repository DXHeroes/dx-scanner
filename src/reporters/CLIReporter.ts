import { blue, bold, Color, green, grey, italic, red, reset, underline, yellow, cyan } from 'colors';
import { injectable } from 'inversify';
import { PracticeImpact, PracticeMetadata, PracticeEvaluationResult } from '../model';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { ReporterUtils } from './ReporterUtils';
import { PracticeDetail } from '../practices/IPractice';
import { GitServiceUtils } from '../services/git/GitServiceUtils';
import { ReportDetailType, ReporterData } from './ReporterData';
import { assertNever } from '../lib/assertNever';

@injectable()
export class CLIReporter implements IReporter {
  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    const reportString = this.buildReport(practicesAndComponents);
    console.log(reportString);
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string {
    const lines: string[] = [];

    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);
    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents);

    lines.push(bold(blue('----------------------------')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('|     DX Scanner Result    |')));
    lines.push(bold(blue('|                          |')));

    let repoName;

    for (const cwp of componentsWithPractices) {
      repoName = GitServiceUtils.getRepoName(cwp.component.repositoryPath, cwp.component.path);

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
      (p) => p.overridenImpact === impact && p.isOn === true && p.evaluation === PracticeEvaluationResult.notPracticing,
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

      if (practiceWithContext.practice.data?.details) {
        const linesWithDetail = practiceWithContext.practice.data.details.map((d) => this.renderDetail(d)).join(' ');
        lines.push(reset(grey(linesWithDetail)));
      }

      if (practiceWithContext.practice.impact !== practiceWithContext.overridenImpact) {
        lines.push(reset(bold(this.lineForChangedImpact(practiceWithContext, grey))));
      }
    }

    lines.push('');
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

  private lineForChangedImpact(practiceWithContext: PracticeWithContextForReporter, color: Color) {
    return reset(
      color(
        `  Impact changed from ${underline(practiceWithContext.practice.impact)} to ${underline(practiceWithContext.overridenImpact)}.`,
      ),
    );
  }

  private renderDetail(detail: PracticeDetail) {
    switch (detail.type) {
      case ReportDetailType.table:
        return ReporterData.table(detail.headers, detail.data);

      case ReportDetailType.text:
        return detail.text;

      default:
        return assertNever(detail);
    }
  }
}
