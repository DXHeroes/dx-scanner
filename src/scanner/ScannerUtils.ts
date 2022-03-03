import _ from 'lodash';
import filterAsync from 'node-filter-async';
import toposort from 'toposort';
import { ProjectComponentContext } from '../contexts/projectComponent/ProjectComponentContext';
import { ErrorFactory } from '../lib/errors';
import { PracticeImpact, PracticeEvaluationResult } from '../model';
import { IPracticeWithMetadata } from '../practices/DxPracticeDecorator';
import { IPractice } from '../practices/IPractice';
import { PracticeWithContext, ScanResult } from './Scanner';
import { PracticeWithContextForReporter } from '../reporters/IReporter';
import { ArgumentsProvider } from '.';
import { ScanningStrategyDetectorUtils } from '../detectors/utils/ScanningStrategyDetectorUtils';
import { CliUx } from '@oclif/core';
import { ServiceType } from '../detectors/IScanningStrategy';

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
    const graph: [string, string | undefined][] = [];
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
      (p) => componentContext.configProvider.getOverriddenPractice(p.getMetadata().id)?.impact !== PracticeImpact.off,
    );

    const practicesOff = applicablePractices.filter(
      (p) => componentContext.configProvider.getOverriddenPractice(p.getMetadata().id)?.impact === PracticeImpact.off,
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

  /**
   * Filter out not practicing practices while they are of the same impact as fail value or higher, or of value 'all'.
   */
  static filterNotPracticingPracticesToFail = (
    relevantPractices: PracticeWithContextForReporter[],
    argumentsProvider: ArgumentsProvider,
  ) => {
    return relevantPractices.filter(
      (pctx) =>
        pctx.evaluation === PracticeEvaluationResult.notPracticing &&
        (_.includes(ScannerUtils.getImpactFailureLevels(argumentsProvider.fail), pctx.overridenImpact) || argumentsProvider.fail === 'all'),
    );
  };

  /**
   * Sorts practices alphabetically
   */
  static sortAlphabetically = (practices: IPracticeWithMetadata[]) => {
    return practices.sort((a, b) => a.getMetadata().id.localeCompare(b.getMetadata().id));
  };

  /**
   * Prompt user to insert credentials to get authorization
   */
  static async promptAuthorization(scanPath: string, scanResult: ScanResult) {
    let promptMsg;

    if (ScanningStrategyDetectorUtils.isGitHubPath(scanPath) || scanResult.serviceType === ServiceType.github) {
      promptMsg = 'Insert your GitHub personal access token. https://github.com/settings/tokens\n';
    } else if (ScanningStrategyDetectorUtils.isBitbucketPath(scanPath) || scanResult.serviceType === ServiceType.bitbucket) {
      promptMsg =
        'Insert your Bitbucket credentials (in format "appPassword" or "username:appPasword"). https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html\n';
    } else if (ScanningStrategyDetectorUtils.isGitLabPath(scanPath) || scanResult.serviceType === ServiceType.gitlab) {
      promptMsg = 'Insert your GitLab private token. https://gitlab.com/profile/personal_access_tokens\n';
    } else {
      // if we don't know the service yet
      promptMsg = 'Insert your credentials';
    }

    const authorization = await CliUx.ux.prompt(promptMsg, {
      type: 'hide',
      required: false,
    });

    return authorization;
  }
}
