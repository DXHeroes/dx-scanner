"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaPropertiesUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JavaPropertiesUsedPractice = class JavaPropertiesUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const dotProperties = new RegExp('.(properties)', 'i');
        const propertiesFiles = await ctx.fileInspector.scanFor(dotProperties, '/', { shallow: false });
        if (propertiesFiles.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaPropertiesUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.PropertiesUsed',
        name: 'Store Environment Variables Using .properties Files',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use files such as application.properties to store your sensitive key-value parameters.',
        reportOnlyOnce: true,
        url: 'https://www.baeldung.com/java-properties',
    })
], JavaPropertiesUsedPractice);
exports.JavaPropertiesUsedPractice = JavaPropertiesUsedPractice;
//# sourceMappingURL=JavaPropertiesUsedPractice.js.map