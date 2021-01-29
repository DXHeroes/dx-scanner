"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RubyGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
let RubyGitignoreCorrectlySetPractice = class RubyGitignoreCorrectlySetPractice extends PracticeBase_1.PracticeBase {
    constructor() {
        super(...arguments);
        this.parsedGitignore = [];
    }
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Ruby;
    }
    async evaluate(ctx) {
        if (!ctx.root.fileInspector)
            return model_1.PracticeEvaluationResult.unknown;
        const parseGitignore = (gitignoreFile) => {
            return gitignoreFile
                .toString()
                .split(/\r?\n/)
                .filter((content) => content.trim() !== '' && !content.startsWith('#'));
        };
        const content = await ctx.root.fileInspector.readFile('.gitignore');
        const parsedGitignore = parseGitignore(content);
        this.parsedGitignore = parsedGitignore;
        // binary and cache files
        const coverageRegex = parsedGitignore.find((value) => /\/coverage\//.test(value));
        const temporaryRegex = parsedGitignore.find((value) => /\/tmp\//.test(value));
        const configRegex = parsedGitignore.find((value) => /\/\.config/.test(value));
        // user generated
        const rbcRegex = parsedGitignore.find((value) => /\*\.rbc/.test(value));
        const gemRegex = parsedGitignore.find((value) => /\*\.gem/.test(value));
        if (coverageRegex && temporaryRegex && configRegex && rbcRegex && gemRegex) {
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
        // binary and cache files
        const coverageRegex = this.parsedGitignore.find((value) => /\/coverage\//.test(value));
        const temporaryRegex = this.parsedGitignore.find((value) => /\/tmp\//.test(value));
        const configRegex = this.parsedGitignore.find((value) => /\/\.config/.test(value));
        // user generated
        const rbcRegex = this.parsedGitignore.find((value) => /\*\.rbc/.test(value));
        const gemRegex = this.parsedGitignore.find((value) => /\*\.gem/.test(value));
        const fixes = [
            coverageRegex ? undefined : '/coverage/',
            temporaryRegex ? undefined : '/tmp/',
            configRegex ? undefined : '/.config',
            rbcRegex ? undefined : '*.rbc',
            gemRegex ? undefined : '*.gem',
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
                text: 'You should ignore log, coverage, tmp and .config folders and rbc (*.rbc) and gem (*.gem) files',
            },
        ];
    }
};
RubyGitignoreCorrectlySetPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Ruby.GitignoreCorrectlySet',
        name: 'Set .gitignore Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set patterns in the .gitignore as usual',
        reportOnlyOnce: true,
        url: 'https://github.com/github/gitignore/blob/master/Ruby.gitignore',
        dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
    })
], RubyGitignoreCorrectlySetPractice);
exports.RubyGitignoreCorrectlySetPractice = RubyGitignoreCorrectlySetPractice;
//# sourceMappingURL=RubyGitignoreCorrectlySetPractice.js.map