import _ from 'lodash';
import filterAsync from 'node-filter-async';
import toposort from 'toposort';
import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import { ErrorFactory } from '../lib/errors';
import { PracticeImpact, PracticeEvaluationResult } from '../model';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { IPractice } from '../practices/IPractice';
import { PracticeWithContext } from './Scanner';
import { assertNever } from '../lib/assertNever';
import { PracticeWithContextForReporter } from '../reporters/IReporter';
import { ArgumentsProvider } from '../inversify.config';

/**
 * Scanner helpers & utilities
 */
export class ScannerUtils {
  /**
   * Creates the practice with metadata
   */
  static initPracticeWithMetadata(practice: { new (): IPractice }): IPracticeWithMetadata {
    return <IPracticeWithMetadata>(<unknown>new practice());
  }

  /**
   * Topological sort of directed ascyclic graphs
   */
  static sortPractices(practices: IPracticeWithMetadata[]): IPracticeWithMetadata[] {
    const graph: [string, (string | undefined)][] = [];
    let dependentPractices: string[] = [];

    const allPracticeConstructors = practices.map((p) => p.getMetadata().id);

    for (const practice of practices) {
      const practiceMetadata = practice.getMetadata();

      if (!practiceMetadata.dependsOn) {
        graph.push([practiceMetadata.id, undefined]);
        continue;
      }

      dependentPractices = dependentPractices.concat(..._.compact(_.values(practiceMetadata.dependsOn)));

      for (const dependency of _.uniq(dependentPractices)) {
        //  Throw error if the practice has set incorrect dependencies
        if (!_.includes(allPracticeConstructors, dependency)) {
          throw ErrorFactory.newArgumentError(
            `Practice "${dependency}" does not exists. It's set as dependency of "${practiceMetadata.id}"`,
          );
        }

        graph.push([practiceMetadata.id, dependency]);
      }
    }

    const practicesOrder = _.compact(toposort(graph).reverse());

    return practices.sort((a, b) => practicesOrder.indexOf(a.getMetadata().id) - practicesOrder.indexOf(b.getMetadata().id));
  }

  /**
   * Checks if the practices has fulfilled all dependencies as expected
   */
  static isFulfilled(practice: IPracticeWithMetadata, evaluatedPractices: PracticeWithContext[]): boolean {
    const practiceMetadata = practice.getMetadata();
    if (!practiceMetadata.dependsOn) return true;

    for (const evaluation of _.keys(practiceMetadata.dependsOn)) {
      const dependentPractices: string[] = _.get(practiceMetadata.dependsOn, evaluation);

      for (const depsOnPractice of dependentPractices) {
        const isExpectedEvaluation = evaluatedPractices.find(
          (pwc) => pwc.practice.getMetadata().id === depsOnPractice && pwc.evaluation === evaluation,
        );

        if (!isExpectedEvaluation) return false;
      }
    }

    return true;
  }

  /**
   * Filter out applicable practices and turned off practices.
   */
  static async filterPractices(componentContext: ProjectComponentContext, practices: IPracticeWithMetadata[]) {
    const practiceContext = componentContext.getPracticeContext();

    //need practiceContext.projectComponent
    const applicablePractices = await filterAsync(practices, async (p) => {
      return await p.isApplicable(practiceContext);
    });

    /* Filter out turned off practices */
    const customApplicablePractices = applicablePractices.filter(
      (p) => componentContext.configProvider.getOverriddenPractice(p.getMetadata().id) !== PracticeImpact.off,
    );

    const practicesOff = applicablePractices.filter(
      (p) => componentContext.configProvider.getOverriddenPractice(p.getMetadata().id) === PracticeImpact.off,
    );

    return { customApplicablePractices, practicesOff };
  }

  /**
   * Get all levels to fail on
   */
  static getImpactFailureLevels = (impact: PracticeImpact | 'all' | undefined) => {
    switch (impact) {
      case PracticeImpact.high:
        return [PracticeImpact.high];
      case PracticeImpact.medium:
        return [PracticeImpact.high, PracticeImpact.medium];
      case PracticeImpact.small:
        return [PracticeImpact.high, PracticeImpact.medium, PracticeImpact.small];
      case PracticeImpact.hint:
        return [PracticeImpact.high, PracticeImpact.medium, PracticeImpact.small, PracticeImpact.hint];
      default:
        return [];
    }
  };

  static filterNotPracticingPracticesToFail = (relevantPractices: PracticeWithContextForReporter[], argumentsProvider: ArgumentsProvider) => {
    return reportArguments.filter(
      (practice) =>
        practice.evaluation === PracticeEvaluationResult.notPracticing &&
        (_.includes(ScannerUtils.getImpactFailureLevels(argumentsProvider.fail), practice.impact) || argumentsProvider.fail === 'all'),
    );
  };
}
