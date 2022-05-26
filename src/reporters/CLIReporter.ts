import ansiAlign from 'ansi-align';
import wrapAnsi from 'wrap-ansi';
import boxen from 'boxen';
import { blue, bold, Color, cyan, green, grey, italic, magenta, red, reset, underline, yellow, white } from 'colors';
import debug from 'debug';
import { inject, injectable } from 'inversify';
import { ScanningStrategy } from '../detectors';
import { assertNever } from '../lib/assertNever';
import { logfile } from '../lib/logfile';
import { PracticeEvaluationResult, PracticeImpact, PracticeMetadata } from '../model';
import { PracticeDetail } from '../practices/IPractice';
import { ArgumentsProvider } from '../scanner';
import { GitServiceUtils } from '../services/git/GitServiceUtils';
import { Types } from '../types';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { ReportDetailType, ReporterData } from './ReporterData';
import { ReporterUtils } from './ReporterUtils';

const prependLinesWith = (text: string, symbol: string) => {
  return `${symbol}${text.replace(/\n/g, `\n${symbol}`)}`;
};

@injectable()
export class CLIReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly scanningStrategy: ScanningStrategy;

  constructor(
    @inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider,
    @inject(Types.ScanningStrategy) scanningStrategy: ScanningStrategy,
  ) {
    this.argumentsProvider = argumentsProvider;
    this.scanningStrategy = scanningStrategy;
  }

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    debug.log(this.buildReport(practicesAndComponents));
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string {
    const lines: string[] = [];

    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents, this.scanningStrategy);
    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents, this.scanningStrategy);

    lines.push(bold(blue(boxen('DX Scanner Result', { padding: 1 }))));
    /* lines.push(bold(blue('----------------------------')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('|     DX Scanner Result    |')));
    lines.push(bold(blue('|                          |'))); */

    let componentPath: string;

    for (const cwp of componentsWithPractices) {
      componentPath = GitServiceUtils.getComponentPath(cwp.component, this.scanningStrategy);

      // lines.push(bold(blue('----------------------------')));
      // lines.push('');
      // lines.push(bold(blue(`Developer Experience Report for ${italic(componentPath)}`)));
      // lines.push(cyan(bold(`DX Score: ${dxScore.components.find((c) => c.path === cwp.component.path)!.value}`)));
      // lines.push('');
      lines.push(
        boxen(
          ansiAlign(
            `${cyan(bold(`DX Score is ${dxScore.components.find((c) => c.path === cwp.component.path)!.value}`))}\nFor repository ${italic(
              componentPath,
            )}`,
          ),
          { padding: 2 },
        ),
      );

      for (const key in PracticeImpact) {
        const impact = PracticeImpact[key as keyof typeof PracticeImpact];

        const impactLine = this.emitImpactSegment(cwp.practicesAndComponents, impact);
        impactLine && lines.push(impactLine);
      }

      const practicesAndComponentsUnknown = cwp.practicesAndComponents.filter(
        (p) => p.isOn && p.evaluation === PracticeEvaluationResult.unknown,
      );
      if (practicesAndComponentsUnknown.length > 0) {
        lines.push(bold(yellow('⚠ Evaluation of these practices failed:')));
        lines.push('');

        for (const p of practicesAndComponentsUnknown) {
          lines.push(`- ${bold(p.practice.name)} (Reason: ${p.evaluationError})`);
        }
        lines.push('');
      }

      const practicesAndComponentsOff = cwp.practicesAndComponents.filter((p) => !p.isOn);
      if (practicesAndComponentsOff.length > 0) {
        lines.push(bold(red('! You have turned off these practices:')));
        lines.push('');

        for (const p of practicesAndComponentsOff) {
          lines.push(red(`- ${italic(p.practice.name)}`));
        }
        lines.push('');
      }

      const fixablePractice = (p: PracticeWithContextForReporter) =>
        p.practice.fix && p.evaluation === PracticeEvaluationResult.notPracticing;
      const fixablePractices = cwp.practicesAndComponents.filter(fixablePractice);
      if (fixablePractices.length) {
        lines.push(bold(green('These practices might be automatically fixed')));
        lines.push(`(re-run the command with ${italic('--fix')} option and on a ${bold('local')} folder):`);
        lines.push('');

        for (const p of fixablePractices) {
          lines.push(`- ${bold(p.practice.name)}`);
        }
        lines.push('');
      }
    }

    lines.push(bold(cyan(boxen(`Your overall score is ${dxScore.value}.`, { padding: 1 }))));
    lines.push(italic(blue('Implementation is not adoption.')));
    lines.push(italic(blue('We can help you with both. :-)')));
    lines.push(italic(blue('- https://dxheroes.io')));
    lines.push('');
    lines.push(italic(red('Join us on Slack! - https://bit.ly/slack_developer_experience')));

    lines.push(reset(' '));

    if (!this.argumentsProvider.details)
      lines.push(green(`You can run the command with option ${italic('-d')} or ${italic('--details')} to show detailed informations.\n`));
    if (logfile.enabled) lines.push(magenta(`See the debug log in the file ${logfile.fname}\n`));

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
      lines.push('');

      if (this.argumentsProvider.details && practiceWithContext.practice.data?.details) {
        const linesWithDetail = practiceWithContext.practice.data.details.map((d) => this.renderDetail(d)).join(' ');
        lines.push(reset(grey(linesWithDetail)));
      }

      if (practiceWithContext.practice.impact !== practiceWithContext.overridenImpact) {
        lines.push(reset(bold(this.lineForChangedImpact(practiceWithContext, grey))));
      }
    }

    lines.push(white.dim('='.repeat(80)));
    lines.push('');
    return lines.join('\n');
  }

  private linesForPractice(practice: PracticeMetadata, color: Color): string {
    const findingPath = '';
    const practiceLineTexts = [wrapAnsi(reset(white(`${color('⏹')} ${bold(practice.name)}`)), 80)];
    practiceLineTexts.push('\n');
    practiceLineTexts.push(prependLinesWith(wrapAnsi(white(`${practice.suggestion}`), 80), color('| ')));
    if (practice.url) {
      practiceLineTexts.push('\n');
      practiceLineTexts.push(prependLinesWith(wrapAnsi(reset(`${findingPath}${practice.url}`), 80), color('| ')));
    }

    return practiceLineTexts.join('');
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
