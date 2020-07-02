import _ from 'lodash';
import { assertNever } from '../lib/assertNever';
import { PracticeEvaluationResult, PracticeImpact, PracticeMetadata, ProjectComponent } from '../model';
import { PracticeWithContextForReporter } from './IReporter';
import { DXScoreOverallResult, DXScoreResult } from './model';
import { GitServiceUtils } from '../services';
import { ScanningStrategy } from '../detectors';

export class ReporterUtils {
  static getComponentsWithPractices(
    practicesAndComponents: PracticeWithContextForReporter[],
    scanningStrategy: ScanningStrategy,
  ): ComponentWithPractices[] {
    const result: ComponentResult[] = [];

    for (const pac of practicesAndComponents) {
      let component: ComponentResult | undefined = _.find(result, { component: { path: pac.component.path } });
      if (!component) {
        const currentComponentReport = {
          component: {
            ...pac.component,
            repositoryPath: pac.component.repositoryPath && GitServiceUtils.getComponentPath(pac.component, scanningStrategy),
          },
          practicesAndComponents: [pac],
        };

        component = currentComponentReport;
        result.push(component);
        continue;
      } else {
        component.practicesAndComponents.push(pac);
      }
    }

    return result;
  }

  static computeDXScore(
    practicesAndComponents: PracticeWithContextForReporter[],
    scanningStrategy: ScanningStrategy,
  ): DXScoreOverallResult {
    const scoreResult: DXScoreOverallResult = { ...this.computeDXScoreResult(practicesAndComponents), components: [] };

    const componentsWithPractices = this.getComponentsWithPractices(practicesAndComponents, scanningStrategy);
    for (const cwp of componentsWithPractices) {
      scoreResult.components.push({
        path: cwp.component.path,
        ...this.computeDXScoreResult(cwp.practicesAndComponents),
      });
    }

    return scoreResult;
  }

  private static computeDXScoreResult(practicesAndComponents: PracticeWithContextForReporter[]): DXScoreResult {
    const score: DXScoreResult = {
      value: 'unknown',
      points: { total: 0, max: 0, percentage: 0 },
      practices: {
        practicing: [],
        notPracticing: [],
        off: [],
      },
    };

    for (const pac of practicesAndComponents) {
      /**
       * Fill off practices
       */
      if (!pac.isOn) {
        score.practices.off.push(pac);
      }

      /**
       * Fill practicing practices
       */
      if (pac.isOn && pac.evaluation === PracticeEvaluationResult.practicing) {
        score.practices.practicing.push(pac);
        score.points.total += this.scoreValueForPractice(pac.practice);
        score.points.max += this.scoreValueForPractice(pac.practice);
      }

      /**
       * Fill not practicing practices
       */
      if (pac.isOn && (pac.evaluation === PracticeEvaluationResult.notPracticing || pac.evaluation === PracticeEvaluationResult.unknown)) {
        score.practices.notPracticing.push(pac);
        score.points.max += this.scoreValueForPractice(pac.practice);
      }
    }

    /**
     * Compute percentage points
     */
    score.points.percentage = score.points.max ? Math.round((100 / score.points.max) * score.points.total) : 0;
    const practicingCount = score.practices.practicing.length;
    const notPracticingCount = score.practices.notPracticing.length;
    const offCount = score.practices.off.length;

    // Build result string
    const valueString = [];
    valueString.push(`${score.points.percentage}%`);
    valueString.push(' | ');
    valueString.push(`${practicingCount}/${practicingCount + notPracticingCount}`);
    if (offCount > 0) valueString.push(` (${offCount} skipped)`);

    score.value = valueString.join('');

    return score;
  }

  static scoreValueForPractice(practiceMetadata: PracticeMetadata): number {
    switch (practiceMetadata.impact) {
      case PracticeImpact.high:
        return 100;
      case PracticeImpact.medium:
        return 75;
      case PracticeImpact.small:
        return 50;
      case PracticeImpact.hint:
        return 25;
      case PracticeImpact.off:
        return 0;
      default:
        return assertNever(practiceMetadata.impact);
    }
  }
}

type ComponentResult = {
  component: ProjectComponent;
  practicesAndComponents: PracticeWithContextForReporter[];
};

export type ComponentWithPractices = {
  component: ProjectComponent;
  practicesAndComponents: PracticeWithContextForReporter[];
};
