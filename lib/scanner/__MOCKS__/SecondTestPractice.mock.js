"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondTestPractice = void 0;
const DxPracticeDecorator_1 = require("../../practices/DxPracticeDecorator");
const model_1 = require("../../model");
let SecondTestPractice = class SecondTestPractice {
    async isApplicable() {
        return Promise.resolve(true);
    }
    async evaluate() {
        return Promise.resolve(model_1.PracticeEvaluationResult.practicing);
    }
};
SecondTestPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Mock.SecondTestPractice',
        name: 'SecondTestPractice',
        impact: model_1.PracticeImpact.medium,
        suggestion: '...',
        reportOnlyOnce: true,
        url: '...',
        dependsOn: { practicing: ['Mock.FirstTestPractice'] },
    })
], SecondTestPractice);
exports.SecondTestPractice = SecondTestPractice;
//# sourceMappingURL=SecondTestPractice.mock.js.map