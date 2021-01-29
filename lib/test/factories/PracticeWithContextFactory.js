"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.practiceWithContextFactory = void 0;
const model_1 = require("../../model");
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
exports.practiceWithContextFactory = (practiceWithContext = {}) => {
    return lodash_1.default.merge({
        component: {
            repositoryPath: path_1.default.resolve('./'),
            path: path_1.default.resolve('./'),
            language: model_1.ProgrammingLanguage.JavaScript,
            framework: model_1.ProjectComponentFramework.UNKNOWN,
            type: model_1.ProjectComponentType.UNKNOWN,
            platform: model_1.ProjectComponentPlatform.UNKNOWN,
        },
        practice: {
            id: 'test.practice',
            name: 'test',
            suggestion: '',
            impact: model_1.PracticeImpact.high,
            url: '.',
            fix: false,
        },
        overridenImpact: model_1.PracticeImpact.high,
        evaluation: model_1.PracticeEvaluationResult.practicing,
        isOn: true,
    }, practiceWithContext);
};
//# sourceMappingURL=PracticeWithContextFactory.js.map