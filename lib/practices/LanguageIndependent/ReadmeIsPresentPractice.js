"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeIsPresentPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let ReadmeIsPresentPractice = class ReadmeIsPresentPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexReadme = new RegExp('readme', 'i');
        const files = await ctx.fileInspector.scanFor(regexReadme, '/', { shallow: true });
        const rootFiles = await ctx.root.fileInspector.scanFor(regexReadme, '/', { shallow: true });
        if (files.length > 0 || rootFiles.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
ReadmeIsPresentPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.ReadmeIsPresent',
        name: 'Create a Readme File',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Add a Readme file to tell other people why is your project useful, what can they do with your project, and how can they use it.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/readme',
    })
], ReadmeIsPresentPractice);
exports.ReadmeIsPresentPractice = ReadmeIsPresentPractice;
//# sourceMappingURL=ReadmeIsPresentPractice.js.map