"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
let JsGitignoreCorrectlySetPractice = class JsGitignoreCorrectlySetPractice extends PracticeBase_1.PracticeBase {
    constructor() {
        super(...arguments);
        this.parsedGitignore = [];
    }
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript;
    }
    async evaluate(ctx) {
        if (!ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const parseGitignore = (gitignoreFile) => {
            return gitignoreFile
                .toString()
                .split(/\r?\n/)
                .filter((content) => content.trim() !== '' && !content.startsWith('#'));
        };
        const content = await ctx.root.fileInspector.readFile('.gitignore');
        const parsedGitignore = parseGitignore(content);
        this.parsedGitignore = parsedGitignore;
        // node_modules
        const nodeModulesRegex = parsedGitignore.find((value) => /node_modules/.test(value));
        // misc
        const coverageRegex = parsedGitignore.find((value) => /coverage/.test(value));
        const errorLogRegex = parsedGitignore.find((value) => /\.log/.test(value));
        if (nodeModulesRegex && errorLogRegex && coverageRegex) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        this.setData();
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    async fix(ctx) {
        var _a;
        const inspector = ((_a = ctx.fileInspector) === null || _a === void 0 ? void 0 : _a.basePath) ? ctx.fileInspector : ctx.root.fileInspector;
        if (!inspector)
            return;
        // node_modules
        const nodeModulesRegex = this.parsedGitignore.find((value) => /node_modules/.test(value));
        // misc
        const coverageRegex = this.parsedGitignore.find((value) => /coverage/.test(value));
        const errorLogRegex = this.parsedGitignore.find((value) => /\.log/.test(value));
        const fixes = [
            nodeModulesRegex ? undefined : '/node_modules',
            coverageRegex ? undefined : '/coverage',
            errorLogRegex ? undefined : '*.log',
        ]
            .filter(Boolean)
            .concat(''); // append newline if we add something
        if (fixes.length > 1)
            fixes.unshift(''); // if there is something to add, make sure we start with newline
        await inspector.appendFile('.gitignore', fixes.join('\n'));
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
    })
], JsGitignoreCorrectlySetPractice);
exports.JsGitignoreCorrectlySetPractice = JsGitignoreCorrectlySetPractice;
//# sourceMappingURL=JsGitignoreCorrectlySetPractice.js.map