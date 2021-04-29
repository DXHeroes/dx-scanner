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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const ReporterData_1 = require("../../reporters/ReporterData");
const GitignoreCorrectlySetPracticeBase_1 = require("../common/GitignoreCorrectlySetPracticeBase");
let JsGitignoreCorrectlySetPractice = class JsGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase_1.GitignoreCorrectlySetPracticeBase {
    constructor() {
        super();
        this.applicableLanguages = [model_1.ProgrammingLanguage.JavaScript];
        this.ruleChecks = [
            // node_modules
            { regex: /node_modules/, fix: '/node_modules' },
            // misc
            { regex: /coverage/, fix: '/coverage' },
            { regex: /\.log/, fix: '*.log' },
        ];
    }
    setData() {
        this.data.details = [
            {
                type: ReporterData_1.ReportDetailType.text,
                text: 'You should ignore one of the lock files (package-lock.json or yarn.lock), node_modules folder, coverage folder and log files (*.log)',
            },
        ];
    }
};
JsGitignoreCorrectlySetPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.GitignoreCorrectlySet',
        name: 'Set .gitignore Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set patterns in the .gitignore as usual.',
        reportOnlyOnce: true,
        url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
        dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
    }),
    __metadata("design:paramtypes", [])
], JsGitignoreCorrectlySetPractice);
exports.JsGitignoreCorrectlySetPractice = JsGitignoreCorrectlySetPractice;
//# sourceMappingURL=JsGitignoreCorrectlySetPractice.js.map