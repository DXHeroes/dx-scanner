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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIReporter = void 0;
const colors_1 = require("colors");
const debug_1 = __importDefault(require("debug"));
const inversify_1 = require("inversify");
const assertNever_1 = require("../lib/assertNever");
const logfile_1 = require("../lib/logfile");
const model_1 = require("../model");
const GitServiceUtils_1 = require("../services/git/GitServiceUtils");
const types_1 = require("../types");
const ReporterData_1 = require("./ReporterData");
const ReporterUtils_1 = require("./ReporterUtils");
let CLIReporter = class CLIReporter {
    constructor(argumentsProvider, scanningStrategy) {
        this.argumentsProvider = argumentsProvider;
        this.scanningStrategy = scanningStrategy;
    }
    async report(practicesAndComponents) {
        debug_1.default.log(this.buildReport(practicesAndComponents));
    }
    buildReport(practicesAndComponents) {
        const lines = [];
        const componentsWithPractices = ReporterUtils_1.ReporterUtils.getComponentsWithPractices(practicesAndComponents, this.scanningStrategy);
        const dxScore = ReporterUtils_1.ReporterUtils.computeDXScore(practicesAndComponents, this.scanningStrategy);
        lines.push(colors_1.bold(colors_1.blue('----------------------------')));
        lines.push(colors_1.bold(colors_1.blue('|                          |')));
        lines.push(colors_1.bold(colors_1.blue('|     DX Scanner Result    |')));
        lines.push(colors_1.bold(colors_1.blue('|                          |')));
        let componentPath;
        for (const cwp of componentsWithPractices) {
            componentPath = GitServiceUtils_1.GitServiceUtils.getComponentPath(cwp.component, this.scanningStrategy);
            lines.push(colors_1.bold(colors_1.blue('----------------------------')));
            lines.push('');
            lines.push(colors_1.bold(colors_1.blue(`Developer Experience Report for ${colors_1.italic(componentPath)}`)));
            lines.push(colors_1.cyan(colors_1.bold(`DX Score: ${dxScore.components.find((c) => c.path === cwp.component.path).value}`)));
            lines.push('');
            for (const key in model_1.PracticeImpact) {
                const impact = model_1.PracticeImpact[key];
                const impactLine = this.emitImpactSegment(cwp.practicesAndComponents, impact);
                impactLine && lines.push(impactLine);
            }
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
            const fixablePractice = (p) => p.practice.fix && p.evaluation === model_1.PracticeEvaluationResult.notPracticing;
            const fixablePractices = cwp.practicesAndComponents.filter(fixablePractice);
            if (fixablePractices.length) {
                lines.push(colors_1.bold(colors_1.yellow(`These practices might be automatically fixed (re-run the command with ${colors_1.italic('--fix')} option and on a ${colors_1.bold('local')} folder):`)));
                lines.push('');
                for (const p of fixablePractices) {
                    lines.push(colors_1.yellow(`- ${p.practice.name}`));
                }
                lines.push('');
            }
        }
        lines.push('----------------------------');
        lines.push('');
        lines.push(colors_1.bold(colors_1.cyan(`Your overall score is ${dxScore.value}.`)));
        lines.push('');
        lines.push(colors_1.italic(colors_1.blue('Implementation is not adoption.')));
        lines.push(colors_1.italic(colors_1.blue('We can help you with both. :-)')));
        lines.push(colors_1.italic(colors_1.blue('- https://dxheroes.io')));
        lines.push('');
        lines.push(colors_1.italic(colors_1.red('Join us on Slack! - https://bit.ly/slack_developer_experience')));
        lines.push(colors_1.reset(' '));
        if (!this.argumentsProvider.details)
            lines.push(colors_1.green(`You can run the command with option ${colors_1.italic('-d')} or ${colors_1.italic('--details')} to show detailed informations.\n`));
        if (logfile_1.logfile.enabled)
            lines.push(colors_1.magenta(`See the debug log in the file ${logfile_1.logfile.fname}\n`));
        return lines.join('\n');
    }
    emitImpactSegment(practicesAndComponents, impact) {
        var _a;
        const lines = [];
        const practices = practicesAndComponents.filter((p) => p.overridenImpact === impact && p.isOn === true && p.evaluation === model_1.PracticeEvaluationResult.notPracticing);
        if (practices.length === 0)
            return undefined;
        let color = colors_1.blue;
        if (impact === model_1.PracticeImpact.high) {
            color = colors_1.red;
            lines.push(colors_1.bold(color('Improvements with highest impact:\n')));
        }
        else if (impact === model_1.PracticeImpact.medium) {
            color = colors_1.yellow;
            lines.push(colors_1.bold(color('Improvements with medium impact:\n')));
        }
        else if (impact === model_1.PracticeImpact.small) {
            color = colors_1.green;
            lines.push(colors_1.bold(color('Improvements with minor impact:\n')));
        }
        else if (impact === model_1.PracticeImpact.off) {
            color = colors_1.grey;
            lines.push(colors_1.bold(color('These practices are off:\n')));
        }
        else {
            color = colors_1.grey;
            lines.push(colors_1.bold(color('Also consider:')));
        }
        for (const practiceWithContext of practices) {
            lines.push(this.linesForPractice(practiceWithContext.practice, color));
            if (this.argumentsProvider.details && ((_a = practiceWithContext.practice.data) === null || _a === void 0 ? void 0 : _a.details)) {
                const linesWithDetail = practiceWithContext.practice.data.details.map((d) => this.renderDetail(d)).join(' ');
                lines.push(colors_1.reset(colors_1.grey(linesWithDetail)));
            }
            if (practiceWithContext.practice.impact !== practiceWithContext.overridenImpact) {
                lines.push(colors_1.reset(colors_1.bold(this.lineForChangedImpact(practiceWithContext, colors_1.grey))));
            }
        }
        lines.push('');
        return lines.join('\n');
    }
    linesForPractice(practice, color) {
        const findingPath = '';
        const practiceLineTexts = [colors_1.reset(color(`- ${colors_1.bold(practice.name)} - ${colors_1.italic(practice.suggestion)}`))];
        if (practice.url) {
            practiceLineTexts.push(color(`${findingPath}${practice.url}`));
        }
        return practiceLineTexts.join(' ');
    }
    lineForChangedImpact(practiceWithContext, color) {
        return colors_1.reset(color(`  Impact changed from ${colors_1.underline(practiceWithContext.practice.impact)} to ${colors_1.underline(practiceWithContext.overridenImpact)}.`));
    }
    renderDetail(detail) {
        switch (detail.type) {
            case ReporterData_1.ReportDetailType.table:
                return ReporterData_1.ReporterData.table(detail.headers, detail.data);
            case ReporterData_1.ReportDetailType.text:
                return detail.text;
            default:
                return assertNever_1.assertNever(detail);
        }
    }
};
CLIReporter = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(types_1.Types.ScanningStrategy)),
    __metadata("design:paramtypes", [Object, Object])
], CLIReporter);
exports.CLIReporter = CLIReporter;
//# sourceMappingURL=CLIReporter.js.map