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
exports.HTMLReporter = void 0;
const inversify_1 = require("inversify");
const model_1 = require("../model");
const ReporterUtils_1 = require("./ReporterUtils");
const ReporterData_1 = require("./ReporterData");
const assertNever_1 = require("../lib/assertNever");
const services_1 = require("../services");
const types_1 = require("../types");
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const logfile_1 = require("../lib/logfile");
let HTMLReporter = class HTMLReporter {
    constructor(argumentsProvider, fileSystemService, scanningStrategy) {
        this.argumentsProvider = argumentsProvider;
        this.scanningStrategy = scanningStrategy;
        this.fileSystemService = fileSystemService;
    }
    async report(practicesAndComponents) {
        const reportHTML = this.buildReport(practicesAndComponents);
        let reportPath;
        if (this.argumentsProvider.html === true)
            reportPath = 'report.html';
        else
            reportPath = this.argumentsProvider.html;
        await this.fileSystemService.writeFile(path_1.default.resolve(process.cwd(), reportPath), reportHTML);
        debug_1.default.log('Report was saved to ' + reportPath);
    }
    buildReport(practicesAndComponents) {
        const lines = [];
        const componentsWithPractices = ReporterUtils_1.ReporterUtils.getComponentsWithPractices(practicesAndComponents, this.scanningStrategy);
        const dxScore = ReporterUtils_1.ReporterUtils.computeDXScore(practicesAndComponents, this.scanningStrategy);
        lines.push('<h1 style="text-align: center">DX Scanner Result</h1>');
        let repoName;
        for (const cwp of componentsWithPractices) {
            repoName = services_1.GitServiceUtils.getRepoName(cwp.component.repositoryPath, cwp.component.path);
            lines.push(`<p style="border-bottom: 1px solid #eaecef">Developer Experience Report for ${repoName}</br>`);
            lines.push(`DX Score: ${dxScore.components.find((c) => c.path === cwp.component.path).value}</p>`);
            for (const key in model_1.PracticeImpact) {
                const impact = model_1.PracticeImpact[key];
                const impactLine = this.emitImpactSegment(cwp.practicesAndComponents, impact);
                impactLine && lines.push(impactLine);
            }
            const practicesAndComponentsUnknown = cwp.practicesAndComponents.filter((p) => p.isOn && p.evaluation === model_1.PracticeEvaluationResult.unknown);
            if (practicesAndComponentsUnknown.length > 0)
                lines.push(this.renderPracticesAndComponents('Evaluation of these practices failed', practicesAndComponentsUnknown));
            const practicesAndComponentsOff = cwp.practicesAndComponents.filter((p) => !p.isOn);
            if (practicesAndComponentsOff.length > 0)
                lines.push(this.renderPracticesAndComponents('You have turned off these practices', practicesAndComponentsOff));
        }
        lines.push(`<h2 style="text-align: center; border-top: 1px solid #eaecef; padding: 20px 0">Your overall score is ${dxScore.value}.</h2>`);
        lines.push('<div style="text-align: center; background-color: gray; margin: 0; padding: 10px">');
        lines.push('<p>Implementation is not adoption.</br>');
        lines.push('We can help you with both. :-)</p>');
        lines.push('<a href="https://dxheroes.io">https://dxheroes.io</a><br />');
        lines.push('<a href="https://bit.ly/slack_developer_experience" target="_blank">Join us on Slack!</a>');
        if (logfile_1.logfile.enabled) {
            lines.push(`<p>See the debug log in the file ${logfile_1.logfile.fname}</p>`);
        }
        lines.push('</div>');
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Report</title>
      </head>
      <div>${lines.join('\n')}</div>
      </html>
    `;
    }
    emitImpactSegment(practicesAndComponents, impact) {
        var _a;
        const lines = [];
        const practices = practicesAndComponents.filter((p) => p.overridenImpact === impact && p.isOn === true && p.evaluation === model_1.PracticeEvaluationResult.notPracticing);
        if (practices.length === 0)
            return undefined;
        let color, text;
        if (impact === model_1.PracticeImpact.high) {
            color = 'rgba(255,0,0,.5)';
            text = 'Improvements with highest impact:';
        }
        else if (impact === model_1.PracticeImpact.medium) {
            color = 'rgba(255,196,0,.5)';
            text = 'Improvements with medium impact:';
        }
        else if (impact === model_1.PracticeImpact.small) {
            color = 'rgba(0,255,0,.5)';
            text = 'Improvements with minor impact:';
        }
        else if (impact === model_1.PracticeImpact.off) {
            color = 'rgba(255,255,255,.5)';
            text = 'These practices are off:';
        }
        else {
            color = 'rgba(255,255,255,.5)';
            text = 'Also consider:';
        }
        lines.push(`<div style="background-color: ${color}; padding: 2px">`);
        lines.push(`<h3 style="margin-left: 10px">${text}</h3>`);
        lines.push('<ul>');
        for (const practiceWithContext of practices) {
            lines.push(this.linesForPractice(practiceWithContext.practice));
            if (this.argumentsProvider.details && ((_a = practiceWithContext.practice.data) === null || _a === void 0 ? void 0 : _a.details)) {
                const linesWithDetail = practiceWithContext.practice.data.details.map((d) => this.renderDetail(d)).join(' ');
                lines.push(`<em>${linesWithDetail}</em>`);
            }
            if (practiceWithContext.practice.impact !== practiceWithContext.overridenImpact) {
                lines.push(`<em>Impact changed from ${practiceWithContext.practice.impact} to ${practiceWithContext.overridenImpact}.</em>`);
            }
        }
        lines.push('</ul>');
        lines.push('</div>');
        return lines.join('\n');
    }
    linesForPractice(practice) {
        const findingPath = '';
        let practiceLineText = `<li>${practice.name} - ${practice.suggestion}`;
        if (practice.url)
            practiceLineText += ` ${findingPath} <a href="${practice.url}">${practice.url}</a>`;
        practiceLineText += '</li>';
        return practiceLineText;
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
    renderPracticesAndComponents(name, practicesAndComponents) {
        const lines = [];
        lines.push('<div style="background-color: rgba(255,0,0,.5); padding: 2px">');
        lines.push(`<h3 style="margin-left: 10px">${name}:</h3>`);
        lines.push('<ul>');
        for (const p of practicesAndComponents) {
            lines.push(`<li>${p.practice.name}</li>`);
        }
        lines.push('</ul>');
        lines.push('</div>');
        return lines.join('\n');
    }
};
HTMLReporter = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __param(1, inversify_1.inject(services_1.FileSystemService)),
    __param(2, inversify_1.inject(types_1.Types.ScanningStrategy)),
    __metadata("design:paramtypes", [Object, services_1.FileSystemService, Object])
], HTMLReporter);
exports.HTMLReporter = HTMLReporter;
//# sourceMappingURL=HTMLReporter.js.map