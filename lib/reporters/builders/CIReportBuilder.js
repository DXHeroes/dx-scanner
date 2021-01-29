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
exports.CIReportBuilder = void 0;
const inversify_1 = require("inversify");
const __1 = require("..");
const assertNever_1 = require("../../lib/assertNever");
const model_1 = require("../../model");
const services_1 = require("../../services");
const types_1 = require("../../types");
const ReporterData_1 = require("../ReporterData");
const IReportBuilder_1 = require("./IReportBuilder");
let CIReportBuilder = class CIReportBuilder {
    constructor(practicesAndComponents, scanningStrategy) {
        this.renderHeader = () => {
            const lines = [];
            lines.push(`# [DX Scanner](https://dxscanner.io) Report <a href="https://dxscanner.io" target="_blank"><img src="https://dxscanner.io/logo.png" alt="DXScanner.io" width="40" style="border-radius: 2px;"/></a>`);
            return lines.join('\n');
        };
        this.renderComponent = (cwp, dxScore) => {
            const lines = [];
            lines.push(this.renderComponentHeader(cwp, dxScore));
            lines.push(this.renderImpactsList(cwp.practicesAndComponents));
            lines.push(this.renderUnknownPractices(cwp.practicesAndComponents));
            lines.push(this.renderTurnedOffPractices(cwp.practicesAndComponents));
            lines.push(this.renderFixablePractices(cwp.practicesAndComponents));
            return lines.join('\n');
        };
        this.renderPracticesLines = (practiceWithContext) => {
            var _a;
            const lines = [];
            const practice = practiceWithContext.practice;
            lines.push(`<details>`);
            lines.push(`<summary>${practice.name}</summary>\n`);
            const practiceLineTexts = [`<b>${practice.suggestion}</b>`];
            if (practice.url)
                practiceLineTexts.push(`<a href="${practice.url}">${practice.url}</a>`);
            lines.push(practiceLineTexts.join(' '));
            // render detailed info for a practice
            if ((_a = practice.data) === null || _a === void 0 ? void 0 : _a.details) {
                const linesWithDetail = practice.data.details.map((d) => this.renderDetail(d)).join(' ');
                lines.push(`\n\n${linesWithDetail}`);
            }
            // render line for changed impact if the impact of practice has been changed
            if (practice.impact !== practiceWithContext.overridenImpact) {
                lines.push(`  <b>Impact changed from ${practice.impact} to ${practiceWithContext.overridenImpact}.</b>`);
            }
            lines.push(`</details>`);
            return lines.join('\n');
        };
        this.renderUnknownPractices = (practicesAndComponents) => {
            const lines = [];
            const practicesAndComponentsUnknown = practicesAndComponents.filter((p) => p.isOn && p.evaluation === model_1.PracticeEvaluationResult.unknown);
            if (practicesAndComponentsUnknown.length > 0) {
                lines.push('<h3>🔥 Evaluation of these practices failed</h3>');
                for (const p of practicesAndComponentsUnknown) {
                    lines.push(this.renderPracticesLines(p));
                }
            }
            return lines.join('\n');
        };
        this.renderTurnedOffPractices = (practicesAndComponents) => {
            const lines = [];
            const practicesAndComponentsOff = practicesAndComponents.filter((p) => !p.isOn);
            if (practicesAndComponentsOff.length > 0) {
                lines.push('<h3>🚫 You have turned off these practices</h3>');
                for (const p of practicesAndComponentsOff) {
                    lines.push(this.renderPracticesLines(p));
                }
            }
            return lines.join('\n');
        };
        this.renderFixablePractices = (practicesAndComponents) => {
            const lines = [];
            const fixablePractice = (p) => p.practice.fix && p.evaluation === model_1.PracticeEvaluationResult.notPracticing;
            const fixablePractices = practicesAndComponents.filter(fixablePractice);
            if (fixablePractices.length) {
                lines.push('<h3>🔧 These practices might be automatically fixed:</h3>');
                for (const p of fixablePractices) {
                    lines.push(this.renderPracticesLines(p));
                }
            }
            return lines.join('\n');
        };
        this.renderComponentHeader = (cwp, dxScore) => {
            const lines = [];
            const componentPath = services_1.GitServiceUtils.getComponentPath(cwp.component, this.scanningStrategy);
            // display badge for a component only if there is more than one component because there is overall DX Score at the end of report
            const badge = dxScore.components.length > 1 ? this.renderBadge(dxScore.components.find((c) => c.path === cwp.component.path)) : '';
            lines.push(`## ${componentPath} ${badge}\n`);
            return lines.join('\n');
        };
        this.renderImpactsList = (practicesAndComponents) => {
            const lines = [];
            // render each impact block
            for (const key in model_1.PracticeImpact) {
                const impact = model_1.PracticeImpact[key];
                // filter only not practicing and turned on practices
                const practices = practicesAndComponents.filter((p) => p.overridenImpact === impact && p.isOn === true && p.evaluation === model_1.PracticeEvaluationResult.notPracticing);
                // do not render if no practice is not practicing
                if (practices.length !== 0) {
                    lines.push(this.renderImpactSegment(practices, impact));
                }
            }
            return lines.join('\n');
        };
        this.renderFooter = (dxScore) => {
            const lines = [];
            lines.push(`---\n`);
            lines.push(`${this.renderBadge(dxScore)}\n`);
            lines.push('Implementation is not adoption.');
            lines.push('We can help you with both. :-)');
            lines.push('[dxheroes.io](https://dxheroes.io)');
            lines.push('\n\n');
            lines.push('##### Found a bug? Please <a href="https://github.com/DXHeroes/dx-scanner/issues" target="_blank">report</a>.');
            lines.push('[Join us on Slack!](https://bit.ly/slack_developer_experience)');
            return lines.join('\n');
        };
        this.renderImpactHeadline = (impact) => {
            switch (impact) {
                case model_1.PracticeImpact.high:
                    return '🚨 Improvements with highest impact\n';
                case model_1.PracticeImpact.medium:
                    return '⚠️ Improvements with medium impact\n';
                case model_1.PracticeImpact.small:
                    return '🔔 Improvements with minor impact\n';
                case model_1.PracticeImpact.off:
                    return '🚫 These practices are off\n';
                case model_1.PracticeImpact.hint:
                    return '💡 Also consider';
                default:
                    return assertNever_1.assertNever(impact);
            }
        };
        this.practicesAndComponents = practicesAndComponents;
        this.scanningStrategy = scanningStrategy;
    }
    build() {
        return this.renderFromTemplate();
    }
    /**
     * Main renderer
     */
    renderFromTemplate() {
        const lines = [];
        const componentsWithPractices = __1.ReporterUtils.getComponentsWithPractices(this.practicesAndComponents, this.scanningStrategy);
        const dxScore = __1.ReporterUtils.computeDXScore(this.practicesAndComponents, this.scanningStrategy);
        // render html comment as an ID for updating PR comment
        lines.push(CIReportBuilder.ciReportIndicator);
        // render header
        lines.push(this.renderHeader());
        for (const cwp of componentsWithPractices) {
            // render component report
            lines.push(this.renderComponent(cwp, dxScore));
        }
        lines.push(this.renderFooter(dxScore));
        return lines.join('\n');
    }
    renderImpactSegment(practicesAndComponents, impact) {
        const lines = [];
        lines.push(`<h3>${this.renderImpactHeadline(impact)}</h3>`);
        // render each practice detail
        for (const practiceWithContext of practicesAndComponents) {
            lines.push(this.renderPracticesLines(practiceWithContext));
        }
        return lines.join('\n');
    }
    renderDetail(detail) {
        switch (detail.type) {
            case ReporterData_1.ReportDetailType.table:
                return ReporterData_1.ReporterData.markdownTable(detail.headers, detail.data);
            case ReporterData_1.ReportDetailType.text:
                return detail.text;
            default:
                return assertNever_1.assertNever(detail);
        }
    }
    renderBadge(score) {
        return `<img src="https://img.shields.io/badge/DX%20Score-${encodeURI(score.value)}-${this.badgeColor(score)}?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBmaWxsPSIjMzlEMkRBIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiwxOS4xNzE0Mjg2IEwxNS40Mjg1NzE0LDE1LjczNzE0MjkgTDE3LjE0Mjg1NzEsMTcuNDU0Mjg1NyBMMTIsMjIuNjA1NzE0MyBMNi44NTcxNDI4NiwxNy40NTQyODU3IEw4LjU3MTQyODU3LDE1LjczNzE0MjkgTDEyLDE5LjE3MTQyODYgWiBNMTIsNS40MzQyODU3MSBMMTUuNDI4NTcxNCwyIEwxNy4xNDI4NTcxLDMuNzE3MTQyODYgTDEyLDguODY4NTcxNDMgTDYuODU3MTQyODYsMy43MTcxNDI4NiBMOC41NzE0Mjg1NywyIEwxMiw1LjQzNDI4NTcxIFogTTEyLDEyLjMwNjY3NjcgTDE1LjQyODU3MTQsOC44NzIzOTEwMSBMMTcuMTQyODU3MSwxMC41ODk1MzM5IEwxMiwxNS43NDA5NjI0IEw2Ljg1NzE0Mjg2LDEwLjU4OTUzMzkgTDguNTcxNDI4NTcsOC44NzIzOTEwMSBMMTIsMTIuMzA2Njc2NyBaIE0yMC41NzE0Mjg2LDEwLjU4NTcxNDMgTDE3LjE0Mjg1NzEsNy4xNTE0Mjg1NyBMMTguODU3MTQyOSw1LjQzNDI4NTcxIEwyNCwxMC41ODU3MTQzIEwxOC44NTcxNDI5LDE1LjczNzE0MjkgTDE3LjE0Mjg1NzEsMTQuMDIgTDIwLjU3MTQyODYsMTAuNTg1NzE0MyBaIE0zLjQyODU3MTQzLDEwLjU4NTcxNDMgTDYuODU3MTQyODYsMTQuMDIgTDUuMTQyODU3MTQsMTUuNzM3MTQyOSBMMCwxMC41ODU3MTQzIEw1LjE0Mjg1NzE0LDUuNDM0Mjg1NzEgTDYuODU3MTQyODYsNy4xNTE0Mjg1NyBMMy40Mjg1NzE0MywxMC41ODU3MTQzIFoiLz4KPC9zdmc+Cg=="/>`;
    }
    badgeColor(score) {
        const pctg = score.points.percentage;
        let color;
        if (pctg > 90) {
            color = IReportBuilder_1.BadgeColor.brightgreen;
        }
        else if (pctg > 80) {
            color = IReportBuilder_1.BadgeColor.green;
        }
        else if (pctg > 70) {
            color = IReportBuilder_1.BadgeColor.yellowgreen;
        }
        else if (pctg > 60) {
            color = IReportBuilder_1.BadgeColor.yellow;
        }
        else if (pctg > 40) {
            color = IReportBuilder_1.BadgeColor.orange;
        }
        else {
            color = IReportBuilder_1.BadgeColor.red;
        }
        return color;
    }
};
CIReportBuilder.ciReportIndicator = '<!-- CIReport ID to detect report comment -->';
CIReportBuilder = __decorate([
    __param(1, inversify_1.inject(types_1.Types.ScanningStrategy)),
    __metadata("design:paramtypes", [Array, Object])
], CIReportBuilder);
exports.CIReportBuilder = CIReportBuilder;
//# sourceMappingURL=CIReportBuilder.js.map