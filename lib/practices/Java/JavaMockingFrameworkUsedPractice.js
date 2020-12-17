"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaMockingFrameworkUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let JavaMockingFrameworkUsedPractice = class JavaMockingFrameworkUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.packageInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        // include the group ID and artifact ID when searching for packages in Java in dxs
        if (ctx.packageInspector.hasOneOfPackages([
            'org.testifyproject.mock:mockito',
            'org.mockito:mockito-core',
            'org.powermock:powermock',
            'org.powermock:powermock-core',
            'org.jmock:jmock',
            'org.jmock:jmock-parent',
            'org.easymock:easymock',
            'org.easymock:easymock-parent',
            'org.jmockit:jmockit',
            'com.googlecode.jmockit:jmockit',
            'mockit:jmockit',
        ])) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaMockingFrameworkUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.MockingFrameworkUsedPractice',
        name: 'Use Mocking Frameworks for Tests',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use mocking frameworks such as Mockito or JMock to improve your tests.',
        reportOnlyOnce: true,
        url: 'https://site.mockito.org/',
    })
], JavaMockingFrameworkUsedPractice);
exports.JavaMockingFrameworkUsedPractice = JavaMockingFrameworkUsedPractice;
//# sourceMappingURL=JavaMockingFrameworkUsedPractice.js.map