"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerizationUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let DockerizationUsedPractice = class DockerizationUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.type !== model_1.ProjectComponentType.Library;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexDocker = new RegExp(/dockerfile|docker-compose\.yml/, 'i');
        const dockerfiles = await ctx.fileInspector.scanFor(regexDocker, '/');
        const rootDockerfiles = await ctx.root.fileInspector.scanFor(regexDocker, '/', { shallow: true });
        if (dockerfiles.length > 0 || rootDockerfiles.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
DockerizationUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.DockerizationUsed',
        name: 'Use Docker',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Use docker to create, deploy, and run applications easier by using containers.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/dockerizing',
    })
], DockerizationUsedPractice);
exports.DockerizationUsedPractice = DockerizationUsedPractice;
//# sourceMappingURL=DockerizationUsedPractice.js.map