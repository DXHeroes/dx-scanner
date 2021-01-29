"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
let CSharpGitignoreCorrectlySetPractice = class CSharpGitignoreCorrectlySetPractice extends PracticeBase_1.PracticeBase {
    constructor() {
        super(...arguments);
        this.parsedGitignore = [];
    }
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.CSharp;
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
        const binaryRegex = parsedGitignore.find((value) => /(?:\[Bb\]|b|B)in/.test(value));
        const cacheRegex = parsedGitignore.find((value) => /(?:\[Cc\]|C|c)ache/.test(value));
        const objectRegex = parsedGitignore.find((value) => /(?:\[Oo\]|O|o)bj/.test(value));
        // user generated
        const userRegex = parsedGitignore.find((value) => /\*\.user/.test(value));
        const suoRegex = parsedGitignore.find((value) => /\*\.suo/.test(value));
        const logRegex = parsedGitignore.find((value) => /\*\.log/.test(value));
        if (binaryRegex && cacheRegex && objectRegex && userRegex && suoRegex && logRegex) {
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
        const binaryRegex = this.parsedGitignore.find((value) => /^(?:\[Bb\]|b|B)in\b/.test(value));
        const cacheRegex = this.parsedGitignore.find((value) => /^(?:\[Cc\]|C|c)ache\b/.test(value));
        const objectRegex = this.parsedGitignore.find((value) => /^(?:\[Oo\]|O|o)bj\b/.test(value));
        // user generated
        const userRegex = this.parsedGitignore.find((value) => /^\*\.user\b/.test(value));
        const suoRegex = this.parsedGitignore.find((value) => /^\*\.suo\b/.test(value));
        const logRegex = this.parsedGitignore.find((value) => /\*\.log/.test(value));
        const fixes = [
            binaryRegex ? undefined : '[Bb]in/',
            cacheRegex ? undefined : '[Cc]ache/',
            objectRegex ? undefined : '[Oo]bj/',
            userRegex ? undefined : '*.user',
            suoRegex ? undefined : '*.suo',
            logRegex ? undefined : '*.log',
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
                text: 'You should ignore bin, cache and obj folders and user (*.user), suo (*.suo) and log (*.log) files',
            },
        ];
    }
};
CSharpGitignoreCorrectlySetPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'CSharp.GitignoreCorrectlySet',
        name: 'Set .gitignore Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set patterns in the .gitignore as usual',
        reportOnlyOnce: true,
        url: 'https://github.com/github/gitignore/blob/master/VisualStudio.gitignore',
        dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
    })
], CSharpGitignoreCorrectlySetPractice);
exports.CSharpGitignoreCorrectlySetPractice = CSharpGitignoreCorrectlySetPractice;
//# sourceMappingURL=C#GitignoreCorrectlySetPractice.js.map