import toposort from 'toposort';
import _ from 'lodash';
import { IPractice } from '../practices/IPractice';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { PracticeWithContext } from './Scanner';
import { ErrorFactory } from '../lib/errors';
import { multiInject } from 'inversify';
import { Types } from '../types';
import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import filterAsync from 'node-filter-async';
import { PracticeImpact } from '../model';

/**
 * Scanner helpers & utilities
 */
export class ScannerUtils {
  /**
   * Creates the practice with metadata
   */
  static initPracticeWithMetadata(practice: { new(): IPractice }): IPracticeWithMetadata {
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

  static async filterPractices(componentContext: ProjectComponentContext, practices: IPracticeWithMetadata[]) {
    await componentContext.configProvider.init();
    const practiceContext = componentContext.getPracticeContext();

    const applicablePractices = await filterAsync(practices, async (p) => {
      return await p.isApplicable(practiceContext);
    });

    /* Filter out turned off practices */
    const customApplicablePractices = applicablePractices.filter(
      (p) => componentContext.configProvider.getOverridenPractice(p.getMetadata().id) !== PracticeImpact.off,
    );

    const practicesOffWithMetadata = applicablePractices.filter(
      (p) => componentContext.configProvider.getOverridenPractice(p.getMetadata().id) === PracticeImpact.off,
    );

    return { customApplicablePractices, practicesOffWithMetadata }
  }

}
