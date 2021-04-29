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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const ReporterData_1 = require("../../reporters/ReporterData");
const path = __importStar(require("path"));
const GitignoreCorrectlySetPracticeBase_1 = require("../common/GitignoreCorrectlySetPracticeBase");
let TsGitignoreCorrectlySetPractice = class TsGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase_1.GitignoreCorrectlySetPracticeBase {
    constructor() {
        super();
        this.applicableLanguages = [model_1.ProgrammingLanguage.TypeScript];
        this.ruleChecks = [
            // node_modules
            { regex: /node_modules/, fix: 'node_modules/' },
            // misc
            { regex: /coverage/, fix: '/coverage' },
            { regex: /\.log/, fix: '*.log' },
            // tsconfig check
            {
                check: (ctx, v) => {
                    if (this.tsconfigOutdir === undefined) {
                        return undefined;
                    }
                    if (new RegExp(this.tsconfigOutdir).test(v)) {
                        return undefined;
                    }
                    return `/${this.tsconfigOutdir}`;
                },
            },
            {
                check: (ctx, v) => {
                    if (this.tsconfigOutfile === undefined) {
                        return undefined;
                    }
                    if (new RegExp(this.tsconfigOutfile).test(v)) {
                        return undefined;
                    }
                    return `${this.tsconfigOutfile}`;
                },
            },
        ];
    }
    async evaluate(ctx) {
        const fileInspector = await GitignoreCorrectlySetPracticeBase_1.GitignoreCorrectlySetPracticeBase.checkFileInspector(ctx);
        if (!fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        /**
         * We need to require tsconfig here due to issues with tsconfig in DXSE
         */
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        this.tsconfig = require('tsconfig');
        const tsConfig = await this.tsconfig.load(fileInspector.basePath || '.');
        this.tsconfigOutdir = undefined;
        this.tsconfigOutfile = undefined;
        if (tsConfig) {
            if (tsConfig.config.compilerOptions.outDir) {
                this.tsconfigOutdir = path.basename(tsConfig.config.compilerOptions.outDir);
            }
            else if (tsConfig.config.compilerOptions.outFile) {
                this.tsconfigOutfile = path.basename(tsConfig.config.compilerOptions.outFile);
            }
        }
        return super.evaluate(ctx);
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
    }),
    __metadata("design:paramtypes", [])
], TsGitignoreCorrectlySetPractice);
exports.TsGitignoreCorrectlySetPractice = TsGitignoreCorrectlySetPractice;
//# sourceMappingURL=TsGitignoreCorrectlySetPractice.js.map