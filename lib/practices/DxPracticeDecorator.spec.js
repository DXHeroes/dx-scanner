"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DxPracticeDecorator_1 = require("./DxPracticeDecorator");
const model_1 = require("../model");
const inversify_1 = require("inversify");
const types_1 = require("../types");
describe('DxPractice class decorator', () => {
    const mockPracticeMetadata = {
        id: 'test.mockPractice',
        name: 'Mock Practice',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Practice only used for internal tests.',
        reportOnlyOnce: true,
        url: 'https://www.google.com/?q=mocks',
    };
    it('Adds the getMetadata method to the class using the decorator', () => {
        let MockPractice = class MockPractice {
            async evaluate() {
                return model_1.PracticeEvaluationResult.practicing;
            }
            async isApplicable() {
                return true;
            }
        };
        MockPractice = __decorate([
            DxPracticeDecorator_1.DxPractice(mockPracticeMetadata)
        ], MockPractice);
        const mockPractice = new MockPractice();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(mockPractice.getMetadata()).toMatchObject(mockPracticeMetadata);
    });
    it('Makes the class @injectable automatically', () => {
        let MockPractice = class MockPractice {
            async evaluate() {
                return model_1.PracticeEvaluationResult.practicing;
            }
            async isApplicable() {
                return true;
            }
        };
        MockPractice = __decorate([
            DxPracticeDecorator_1.DxPractice(mockPracticeMetadata)
        ], MockPractice);
        const container = new inversify_1.Container();
        container.bind(types_1.Types.Practice).to(MockPractice);
        const practice = container.get(types_1.Types.Practice);
        expect(practice).toBeDefined();
    });
});
//# sourceMappingURL=DxPracticeDecorator.spec.js.map