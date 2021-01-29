"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaLoggerUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JavaLoggerUsedPractice = class JavaLoggerUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.packageInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (ctx.packageInspector.hasOneOfPackages([
            'org.apache.logging.log4j:log4j',
            'org.apache.logging.log4j:log4j-api',
            'org.apache.logging.log4j:log4j-core',
            'ch.qos.logback:logback-classic',
            'org.slf4j:slf4j-api',
        ])) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaLoggerUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.LoggerUsedPractice',
        name: 'Use a Java Logging Dependency',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Use a logging library to avoid errors and even cyber attacks. The most widely used logging library in the Java community is Log4j 2.',
        reportOnlyOnce: true,
        url: 'https://logging.apache.org/log4j/2.x/',
    })
], JavaLoggerUsedPractice);
exports.JavaLoggerUsedPractice = JavaLoggerUsedPractice;
//# sourceMappingURL=JavaLoggerUsedPractice.js.map