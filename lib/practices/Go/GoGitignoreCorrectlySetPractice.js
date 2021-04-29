"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
let GoGitignoreCorrectlySetPractice = class GoGitignoreCorrectlySetPractice extends PracticeBase_1.PracticeBase {
    constructor() {
        super(...arguments);
        this.parsedGitignore = [];
    }
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Go;
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
        // Binaries for programs and plugins regex
        const exeFileRegex = this.parsedGitignore.find((value) => /.exe$/.test(value));
        const exeTiltFileRegex = this.parsedGitignore.find((value) => /.exe~$/.test(value));
        const dllFileRegex = this.parsedGitignore.find((value) => /.dll$/.test(value));
        const soFileRegex = this.parsedGitignore.find((value) => /.so$/.test(value));
        const dylibFileRegex = this.parsedGitignore.find((value) => /.dylib$/.test(value));
        // Test binary, built with `go test -c` regex
        const testFileRegex = this.parsedGitignore.find((value) => /.test$/.test(value));
        // Output of the go coverage tool regex
        const coverageRegex = parsedGitignore.find((value) => /.out$/.test(value));
        if (exeFileRegex && exeTiltFileRegex && dllFileRegex && dylibFileRegex && soFileRegex && testFileRegex && coverageRegex) {
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
        // Binaries for programs and plugins regex
        const exeFileRegex = this.parsedGitignore.find((value) => /.exe$/.test(value));
        const exeTiltFileRegex = this.parsedGitignore.find((value) => /.exe~$/.test(value));
        const dllFileRegex = this.parsedGitignore.find((value) => /.dll$/.test(value));
        const soFileRegex = this.parsedGitignore.find((value) => /.so$/.test(value));
        const dylibFileRegex = this.parsedGitignore.find((value) => /.dylib$/.test(value));
        // Test binary, built with `go test -c` regex
        const testFileRegex = this.parsedGitignore.find((value) => /.test$/.test(value));
        // Output of the go coverage tool regex
        const coverageRegex = this.parsedGitignore.find((value) => /.out$/.test(value));
        const fixes = [
            exeFileRegex ? undefined : '*.exe',
            exeTiltFileRegex ? undefined : '*.exe~',
            dllFileRegex ? undefined : '*.dll',
            soFileRegex ? undefined : '*.so',
            dylibFileRegex ? undefined : '*.dylib',
            testFileRegex ? undefined : '*.test',
            coverageRegex ? undefined : '*.out',
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
                text: 'You should ignore the binaries for programs and plugins(.exe and others).Test binaries should also be ignored as well as .out file also.',
            },
        ];
    }
};
GoGitignoreCorrectlySetPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Go.GitignoreCorrectlySet',
        name: 'Set .gitignore Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set patterns in the .gitignore as usual.',
        reportOnlyOnce: true,
        url: 'https://github.com/github/gitignore/blob/master/Go.gitignore',
        dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
    })
], GoGitignoreCorrectlySetPractice);
exports.GoGitignoreCorrectlySetPractice = GoGitignoreCorrectlySetPractice;
//# sourceMappingURL=GoGitignoreCorrectlySetPractice.js.map