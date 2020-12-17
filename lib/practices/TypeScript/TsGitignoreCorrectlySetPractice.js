"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsGitignoreCorrectlySetPractice = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
const path = __importStar(require("path"));
let TsGitignoreCorrectlySetPractice = class TsGitignoreCorrectlySetPractice extends PracticeBase_1.PracticeBase {
    constructor() {
        super(...arguments);
        this.parsedGitignore = [];
    }
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript;
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
        // folders with compiled code
        const buildRegex = parsedGitignore.find((value) => /build/.test(value));
        const libRegex = parsedGitignore.find((value) => /lib/.test(value));
        const distRegex = parsedGitignore.find((value) => /dist/.test(value));
        // node_modules
        const nodeModulesRegex = parsedGitignore.find((value) => /node_modules/.test(value));
        // misc
        const coverageRegex = parsedGitignore.find((value) => /coverage/.test(value));
        const errorLogRegex = parsedGitignore.find((value) => /\.log/.test(value));
        if ((buildRegex || libRegex || distRegex) && nodeModulesRegex && errorLogRegex && coverageRegex) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        this.setData();
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    async fix(ctx) {
        var _a;
        /**
         * We need to require tsconfig here due to issues with tsconfig in DXSE
         */
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const tsconfig = require('tsconfig');
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
        const tsConfig = await tsconfig.load(inspector.basePath || '.');
        if (tsConfig) {
            if (tsConfig.config.compilerOptions.outDir) {
                const folderName = path.basename(tsConfig.config.compilerOptions.outDir);
                if (!this.parsedGitignore.find((value) => new RegExp(folderName).test(value))) {
                    fixes.unshift(`/${folderName}`);
                }
            }
            else if (tsConfig.config.compilerOptions.outFile) {
                const fileName = path.basename(tsConfig.config.compilerOptions.outFile);
                if (!this.parsedGitignore.find((value) => new RegExp(fileName).test(value))) {
                    fixes.unshift(`${fileName}`);
                }
            }
        }
        if (fixes.length > 1)
            fixes.unshift(''); // if there is something to add, make sure we start with newline
        await inspector.appendFile('.gitignore', fixes.join('\n'));
    }
    setData() {
        this.data.details = [
            {
                type: ReporterData_1.ReportDetailType.text,
                text: 'You should ignore one of the build folders (build, dist or lib), one of the lock files (package-lock.json or yarn.lock), node_modules folder, coverage folder and log files (*.log)',
            },
        ];
    }
};
TsGitignoreCorrectlySetPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'TypeScript.GitignoreCorrectlySet',
        name: 'Set .gitignore Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set patterns in the .gitignore as usual.',
        reportOnlyOnce: true,
        url: 'https://github.com/github/gitignore/blob/master/Node.gitignore',
        dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
    })
], TsGitignoreCorrectlySetPractice);
exports.TsGitignoreCorrectlySetPractice = TsGitignoreCorrectlySetPractice;
//# sourceMappingURL=TsGitignoreCorrectlySetPractice.js.map