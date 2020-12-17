"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixReporter = void 0;
const colors_1 = require("colors");
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
const model_1 = require("../model");
const GitServiceUtils_1 = require("../services/git/GitServiceUtils");
const types_1 = require("../types");
const ReporterUtils_1 = require("./ReporterUtils");
let FixReporter = class FixReporter {
    constructor(argumentsProvider, scanningStrategy) {
        this.argumentsProvider = argumentsProvider;
        this.scanningStrategy = scanningStrategy;
    }
    async report(practicesAndComponents, practicesAndComponentsAfterFix) {
        const reportString = this.buildReport(practicesAndComponents, practicesAndComponentsAfterFix);
        console.log(reportString);
    }
    buildReport(practicesAndComponents, practicesAndComponentsAfterFix) {
        const lines = [];
        const componentsWithPractices = ReporterUtils_1.ReporterUtils.getComponentsWithPractices(practicesAndComponents, this.scanningStrategy);
        const componentsWithPracticesAfterFix = ReporterUtils_1.ReporterUtils.getComponentsWithPractices(practicesAndComponentsAfterFix, this.scanningStrategy);
        const dxScore = ReporterUtils_1.ReporterUtils.computeDXScore(practicesAndComponents, this.scanningStrategy);
        const dxScoreAfterFix = ReporterUtils_1.ReporterUtils.computeDXScore(practicesAndComponentsAfterFix, this.scanningStrategy);
        lines.push(colors_1.bold(colors_1.blue('----------------------------')));
        lines.push(colors_1.bold(colors_1.blue('|                          |')));
        lines.push(colors_1.bold(colors_1.blue('|     DX Scanner Fixer     |')));
        lines.push(colors_1.bold(colors_1.blue('|                          |')));
        let componentPath;
        for (const cwp of componentsWithPractices) {
            componentPath = GitServiceUtils_1.GitServiceUtils.getComponentPath(cwp.component, this.scanningStrategy);
            lines.push(colors_1.bold(colors_1.blue('----------------------------')));
            lines.push('');
            lines.push(colors_1.bold(colors_1.blue(`Developer Experience Report for ${colors_1.italic(componentPath)}`)));
            lines.push(colors_1.cyan(colors_1.bold(`DX Score: ${dxScoreAfterFix.components.find((c) => c.path === cwp.component.path).value}`)));
            lines.push('');
            const practicesAndComponentsUnknown = cwp.practicesAndComponents.filter((p) => p.isOn && p.evaluation === model_1.PracticeEvaluationResult.unknown);
            if (practicesAndComponentsUnknown.length > 0) {
                lines.push(colors_1.bold(colors_1.red('Evaluation of these practices failed:')));
                lines.push('');
                for (const p of practicesAndComponentsUnknown) {
                    lines.push(colors_1.red(`- ${colors_1.bold(p.practice.name)} (Reason: ${p.evaluationError})`));
                }
                lines.push('');
            }
            const practicesAndComponentsOff = cwp.practicesAndComponents.filter((p) => !p.isOn);
            if (practicesAndComponentsOff.length > 0) {
                lines.push(colors_1.bold(colors_1.red('You have turned off these practices:')));
                lines.push('');
                for (const p of practicesAndComponentsOff) {
                    lines.push(colors_1.red(`- ${colors_1.italic(p.practice.name)}`));
                }
                lines.push('');
            }
            const componentBeforeFix = cwp;
            const componentAfterFix = componentsWithPracticesAfterFix.find((cwpaf) => cwpaf.component.path === cwp.component.path);
            const practiceStatusBeforeFix = lodash_1.keyBy(componentBeforeFix.practicesAndComponents, (p) => p.practice.id);
            const practiceStatusAfterFix = lodash_1.keyBy(componentAfterFix === null || componentAfterFix === void 0 ? void 0 : componentAfterFix.practicesAndComponents, (p) => p.practice.id);
            const fixedPractices = Object.entries(practiceStatusAfterFix).filter(([, value]) => value.evaluation === model_1.PracticeEvaluationResult.practicing &&
                practiceStatusBeforeFix[value.practice.id].evaluation !== model_1.PracticeEvaluationResult.practicing);
            if (fixedPractices.length) {
                lines.push(colors_1.bold(colors_1.green('These practices were automatically fixed:')));
                lines.push('');
                for (const [, p] of fixedPractices) {
                    lines.push(colors_1.green(`- ${p.practice.name}`));
                }
                lines.push('');
            }
            const notFixedPractices = Object.entries(practiceStatusAfterFix).filter(([, value]) => value.evaluation === model_1.PracticeEvaluationResult.notPracticing);
            if (notFixedPractices.length) {
                lines.push(colors_1.bold(colors_1.yellow('These practices could not be automatically fixed:')));
                lines.push('');
                for (const [, p] of notFixedPractices) {
                    lines.push(colors_1.yellow(`- ${p.practice.name}`));
                }
                lines.push('');
            }
        }
        lines.push('----------------------------');
        lines.push('');
        lines.push(colors_1.cyan(`Score before fixing: ${dxScore.value}.`));
        lines.push(colors_1.bold(colors_1.cyan(`Your current overall score is ${dxScoreAfterFix.value}.`)));
        lines.push('');
        lines.push(colors_1.italic(colors_1.blue('Implementation is not adoption.')));
        lines.push(colors_1.italic(colors_1.blue('We can help you with both. :-)')));
        lines.push(colors_1.italic(colors_1.blue('- https://dxheroes.io')));
        lines.push(colors_1.reset(' '));
        lines.push(colors_1.italic(colors_1.red('Join us on Slack! - https://bit.ly/slack_developer_experience')));
        if (!this.argumentsProvider.details)
            lines.push(colors_1.green(`You can run the command with option ${colors_1.italic('-d')} or ${colors_1.italic('--details')} to show detailed informations.`));
        return lines.join('\n');
    }
};
FixReporter = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(types_1.Types.ScanningStrategy)),
    __metadata("design:paramtypes", [Object, Object])
], FixReporter);
exports.FixReporter = FixReporter;
//# sourceMappingURL=FixReporter.js.map