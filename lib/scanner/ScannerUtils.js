"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerUtils = void 0;
const lodash_1 = __importDefault(require("lodash"));
const node_filter_async_1 = __importDefault(require("node-filter-async"));
const toposort_1 = __importDefault(require("toposort"));
const errors_1 = require("../lib/errors");
const model_1 = require("../model");
const ScanningStrategyDetectorUtils_1 = require("../detectors/utils/ScanningStrategyDetectorUtils");
const cli_ux_1 = __importDefault(require("cli-ux"));
const IScanningStrategy_1 = require("../detectors/IScanningStrategy");
/**
 * Scanner helpers & utilities
 */
class ScannerUtils {
    /**
     * Creates the practice with metadata
     */
    static initPracticeWithMetadata(practice) {
        return new practice();
    }
    /**
     * Topological sort of directed ascyclic graphs
     */
    static sortPractices(practices) {
        const graph = [];
        let dependentPractices = [];
        const allPracticeConstructors = practices.map((p) => p.getMetadata().id);
        for (const practice of practices) {
            const practiceMetadata = practice.getMetadata();
            if (!practiceMetadata.dependsOn) {
                graph.push([practiceMetadata.id, undefined]);
                continue;
            }
            dependentPractices = dependentPractices.concat(...lodash_1.default.compact(lodash_1.default.values(practiceMetadata.dependsOn)));
            for (const dependency of lodash_1.default.uniq(dependentPractices)) {
                //  Throw error if the practice has set incorrect dependencies
                if (!lodash_1.default.includes(allPracticeConstructors, dependency)) {
                    throw errors_1.ErrorFactory.newArgumentError(`Practice "${dependency}" does not exists. It's set as dependency of "${practiceMetadata.id}"`);
                }
                graph.push([practiceMetadata.id, dependency]);
            }
        }
        const practicesOrder = lodash_1.default.compact(toposort_1.default(graph).reverse());
        return practices.sort((a, b) => practicesOrder.indexOf(a.getMetadata().id) - practicesOrder.indexOf(b.getMetadata().id));
    }
    /**
     * Checks if the practices has fulfilled all dependencies as expected
     */
    static isFulfilled(practice, evaluatedPractices) {
        const practiceMetadata = practice.getMetadata();
        if (!practiceMetadata.dependsOn)
            return true;
        for (const evaluation of lodash_1.default.keys(practiceMetadata.dependsOn)) {
            const dependentPractices = lodash_1.default.get(practiceMetadata.dependsOn, evaluation);
            for (const depsOnPractice of dependentPractices) {
                const isExpectedEvaluation = evaluatedPractices.find((pwc) => pwc.practice.getMetadata().id === depsOnPractice && pwc.evaluation === evaluation);
                if (!isExpectedEvaluation)
                    return false;
            }
        }
        return true;
    }
    /**
     * Filter out applicable practices and turned off practices.
     */
    static async filterPractices(componentContext, practices) {
        const practiceContext = componentContext.getPracticeContext();
        //need practiceContext.projectComponent
        const applicablePractices = await node_filter_async_1.default(practices, async (p) => {
            return await p.isApplicable(practiceContext);
        });
        /* Filter out turned off practices */
        const customApplicablePractices = applicablePractices.filter((p) => { var _a; return ((_a = componentContext.configProvider.getOverriddenPractice(p.getMetadata().id)) === null || _a === void 0 ? void 0 : _a.impact) !== model_1.PracticeImpact.off; });
        const practicesOff = applicablePractices.filter((p) => { var _a; return ((_a = componentContext.configProvider.getOverriddenPractice(p.getMetadata().id)) === null || _a === void 0 ? void 0 : _a.impact) === model_1.PracticeImpact.off; });
        return { customApplicablePractices, practicesOff };
    }
    /**
     * Prompt user to insert credentials to get authorization
     */
    static async promptAuthorization(scanPath, scanResult) {
        let promptMsg;
        if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitHubPath(scanPath) || scanResult.serviceType === IScanningStrategy_1.ServiceType.github) {
            promptMsg = 'Insert your GitHub personal access token. https://github.com/settings/tokens\n';
        }
        else if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isBitbucketPath(scanPath) || scanResult.serviceType === IScanningStrategy_1.ServiceType.bitbucket) {
            promptMsg =
                'Insert your Bitbucket credentials (in format "appPassword" or "username:appPasword"). https://confluence.atlassian.com/bitbucket/app-passwords-828781300.html\n';
        }
        else if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitLabPath(scanPath) || scanResult.serviceType === IScanningStrategy_1.ServiceType.gitlab) {
            promptMsg = 'Insert your GitLab private token. https://gitlab.com/profile/personal_access_tokens\n';
        }
        else {
            // if we don't know the service yet
            promptMsg = 'Insert your credentials';
        }
        const authorization = await cli_ux_1.default.prompt(promptMsg, {
            type: 'hide',
            required: false,
        });
        return authorization;
    }
}
exports.ScannerUtils = ScannerUtils;
/**
 * Get all levels to fail on
 */
ScannerUtils.getImpactFailureLevels = (impact) => {
    switch (impact) {
        case model_1.PracticeImpact.high:
            return [model_1.PracticeImpact.high];
        case model_1.PracticeImpact.medium:
            return [model_1.PracticeImpact.high, model_1.PracticeImpact.medium];
        case model_1.PracticeImpact.small:
            return [model_1.PracticeImpact.high, model_1.PracticeImpact.medium, model_1.PracticeImpact.small];
        case model_1.PracticeImpact.hint:
            return [model_1.PracticeImpact.high, model_1.PracticeImpact.medium, model_1.PracticeImpact.small, model_1.PracticeImpact.hint];
        default:
            return [];
    }
};
/**
 * Filter out not practicing practices while they are of the same impact as fail value or higher, or of value 'all'.
 */
ScannerUtils.filterNotPracticingPracticesToFail = (relevantPractices, argumentsProvider) => {
    return relevantPractices.filter((pctx) => pctx.evaluation === model_1.PracticeEvaluationResult.notPracticing &&
        (lodash_1.default.includes(ScannerUtils.getImpactFailureLevels(argumentsProvider.fail), pctx.overridenImpact) || argumentsProvider.fail === 'all'));
};
/**
 * Sorts practices alphabetically
 */
ScannerUtils.sortAlphabetically = (practices) => {
    return practices.sort((a, b) => a.getMetadata().id.localeCompare(b.getMetadata().id));
};
//# sourceMappingURL=ScannerUtils.js.map