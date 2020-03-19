import { blue, bold, green, grey, italic, red, reset, cyan, yellow } from 'colors';
import { injectable, inject } from 'inversify';
import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { ReporterUtils } from './ReporterUtils';
import { GitServiceUtils } from '../services/git/GitServiceUtils';
import { ArgumentsProvider } from '../scanner';
import { Types } from '../types';
import { keyBy } from 'lodash';

@injectable()
export class FixReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
  }

  async report(
    practicesAndComponents: PracticeWithContextForReporter[],
    practicesAndComponentsAfterFix: PracticeWithContextForReporter[],
  ): Promise<void> {
    const reportString = this.buildReport(practicesAndComponents, practicesAndComponentsAfterFix);
    console.log(reportString);
  }

  buildReport(
    practicesAndComponents: PracticeWithContextForReporter[],
    practicesAndComponentsAfterFix: PracticeWithContextForReporter[],
  ): string {
    const lines: string[] = [];

    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);
    const componentsWithPracticesAfterFix = ReporterUtils.getComponentsWithPractices(practicesAndComponentsAfterFix);
    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents);
    const dxScoreAfterFix = ReporterUtils.computeDXScore(practicesAndComponentsAfterFix);

    lines.push(bold(blue('----------------------------')));
    lines.push(bold(blue('|                          |')));
    lines.push(bold(blue('|     DX Scanner Fixer     |')));
    lines.push(bold(blue('|                          |')));

    let repoName;

    for (const cwp of componentsWithPractices) {
      repoName = GitServiceUtils.getRepoName(cwp.component.repositoryPath, cwp.component.path);

      lines.push(bold(blue('----------------------------')));
      lines.push('');
      lines.push(bold(blue(`Developer Experience Report for ${italic(repoName)}`)));
      lines.push(cyan(bold(`DX Score: ${dxScoreAfterFix.components.find((c) => c.path === cwp.component.path)!.value}`)));
      lines.push('');

      const practicesAndComponentsUnknown = cwp.practicesAndComponents.filter(
        (p) => p.isOn && p.evaluation === PracticeEvaluationResult.unknown,
      );
      if (practicesAndComponentsUnknown.length > 0) {
        lines.push(bold(red('Evaluation of these practices failed:')));
        lines.push('');

        for (const p of practicesAndComponentsUnknown) {
          lines.push(red(`- ${bold(p.practice.name)} (Reason: ${p.evaluationError})`));
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

      const componentBeforeFix = cwp;
      const componentAfterFix = componentsWithPracticesAfterFix.find((cwpaf) => cwpaf.component.path === cwp.component.path);
      const practiceStatusBeforeFix = keyBy(componentBeforeFix.practicesAndComponents, (p) => p.practice.id);
      const practiceStatusAfterFix = keyBy(componentAfterFix?.practicesAndComponents, (p) => p.practice.id);

      const fixedPractices = Object.entries(practiceStatusAfterFix).filter(
        ([, value]) =>
          value.evaluation === PracticeEvaluationResult.practicing &&
          practiceStatusBeforeFix[value.practice.id].evaluation !== PracticeEvaluationResult.practicing,
      );

      if (fixedPractices.length) {
        lines.push(bold(green('These practices were automatically fixed:')));
        lines.push('');

        for (const [, p] of fixedPractices) {
          lines.push(green(`- ${p.practice.name}`));
        }
        lines.push('');
      }

      const notFixedPractices = Object.entries(practiceStatusAfterFix).filter(
        ([, value]) => value.evaluation === PracticeEvaluationResult.notPracticing,
      );
      if (notFixedPractices.length) {
        lines.push(bold(yellow('These practices could not be automatically fixed:')));
        lines.push('');

        for (const [, p] of notFixedPractices) {
          lines.push(yellow(`- ${p.practice.name}`));
        }
        lines.push('');
      }
    }

    lines.push('----------------------------');
    lines.push('');
    lines.push(cyan(`Score before fixing: ${dxScore.value}.`));
    lines.push(bold(cyan(`Your current overall score is ${dxScoreAfterFix.value}.`)));
    lines.push('');
    lines.push(italic(blue('Implementation is not adoption.')));
    lines.push(italic(blue('We can help you with both. :-)')));
    lines.push(italic(blue('- https://dxheroes.io')));
    lines.push(reset(' '));

    if (!this.argumentsProvider.details)
      lines.push(grey(`You can run the command with option ${italic('-d')} or ${italic('--details')} to show detailed informations.`));

    return lines.join('\n');
  }
}
