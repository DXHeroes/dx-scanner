"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const lodash_1 = __importDefault(require("lodash"));
let CIUsedPractice = class CIUsedPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const filesInRootRegex = new RegExp(/\.gitlab\-ci\.yml|\.travis\.yml|\.jenkins\.yml|appveyor\.yml|azure\-pipelines\.yml/, 'i');
        const filesInFoldersToSearch = [
            { fileName: 'config.yml', path: '.circleci' },
            {
                fileName: new RegExp('.+\\.(yml|yaml)$'),
                path: '/.github/workflows',
            },
        ];
        const filesInRoot = await ctx.root.fileInspector.scanFor(filesInRootRegex, '/', { shallow: true, ignoreErrors: true });
        let filesInFolders = [];
        // search for config files in subfolders in a root of component
        if (filesInRoot.length === 0) {
            const foundFilesInFolders = await Promise.all(filesInFoldersToSearch.map((fif) => {
                return ctx.root.fileInspector.scanFor(fif.fileName, fif.path, { shallow: true, ignoreErrors: true });
            }));
            filesInFolders = lodash_1.default.flatten(foundFilesInFolders);
        }
        if (filesInRoot.length > 0 || filesInFolders.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
CIUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.CIUsedPractice',
        name: 'Use Continuous Integration',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Continuous Integration (CI) is a practice of daily integrating code changes. Use CI to reduce the integration risk, improve code quality, and more.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/continuous-integration',
    })
], CIUsedPractice);
exports.CIUsedPractice = CIUsedPractice;
//# sourceMappingURL=CIUsedPractice.js.map