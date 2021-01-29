"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporterUtils = void 0;
const lodash_1 = __importDefault(require("lodash"));
const assertNever_1 = require("../lib/assertNever");
const model_1 = require("../model");
const services_1 = require("../services");
class ReporterUtils {
    static getComponentsWithPractices(practicesAndComponents, scanningStrategy) {
        const result = [];
        for (const pac of practicesAndComponents) {
            let component = lodash_1.default.find(result, { component: { path: pac.component.path } });
            if (!component) {
                const currentComponentReport = {
                    component: Object.assign(Object.assign({}, pac.component), { repositoryPath: pac.component.repositoryPath &&
                            services_1.GitServiceUtils.getPathOrRepoUrl(pac.component.repositoryPath, scanningStrategy, pac.component.path) }),
                    practicesAndComponents: [pac],
                };
                component = currentComponentReport;
                result.push(component);
                continue;
            }
            else {
                component.practicesAndComponents.push(pac);
            }
        }
        return result;
    }
    static computeDXScore(practicesAndComponents, scanningStrategy) {
        const scoreResult = Object.assign(Object.assign({}, this.computeDXScoreResult(practicesAndComponents)), { components: [] });
        const componentsWithPractices = this.getComponentsWithPractices(practicesAndComponents, scanningStrategy);
        for (const cwp of componentsWithPractices) {
            scoreResult.components.push(Object.assign({ path: cwp.component.path }, this.computeDXScoreResult(cwp.practicesAndComponents)));
        }
        return scoreResult;
    }
    static computeDXScoreResult(practicesAndComponents) {
        const score = {
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
            if (pac.isOn && pac.evaluation === model_1.PracticeEvaluationResult.practicing) {
                score.practices.practicing.push(pac);
                score.points.total += this.scoreValueForPractice(pac.practice);
                score.points.max += this.scoreValueForPractice(pac.practice);
            }
            /**
             * Fill not practicing practices
             */
            if (pac.isOn && (pac.evaluation === model_1.PracticeEvaluationResult.notPracticing || pac.evaluation === model_1.PracticeEvaluationResult.unknown)) {
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
        if (offCount > 0)
            valueString.push(` (${offCount} skipped)`);
        score.value = valueString.join('');
        return score;
    }
    static scoreValueForPractice(practiceMetadata) {
        switch (practiceMetadata.impact) {
            case model_1.PracticeImpact.high:
                return 100;
            case model_1.PracticeImpact.medium:
                return 75;
            case model_1.PracticeImpact.small:
                return 50;
            case model_1.PracticeImpact.hint:
                return 25;
            case model_1.PracticeImpact.off:
                return 0;
            default:
                return assertNever_1.assertNever(practiceMetadata.impact);
        }
    }
}
exports.ReporterUtils = ReporterUtils;
//# sourceMappingURL=ReporterUtils.js.map