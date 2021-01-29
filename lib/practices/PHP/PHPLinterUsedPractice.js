"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPLinterUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
let PHPLinterUsedPractice = class PHPLinterUsedPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.PHP;
    }
    async evaluate(ctx) {
        if (ctx.packageInspector) {
            if (ctx.packageInspector.hasOneOfPackages([
                'overtrue/phplint',
                'squizlabs/php_codesniffer',
                'friendsofphp/php-cs-fixer',
                'phpmd/phpmd',
                'phpstan/phpstan',
                'php-parallel-lint/php-parallel-lint',
                'pdepend/pdepend',
                'phan/phan',
            ])) {
                return model_1.PracticeEvaluationResult.practicing;
            }
            else {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.unknown;
    }
};
PHPLinterUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'PHP.LinterUsed',
        name: 'Use Linter',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use Linter to catch dangerous code constructs.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/linting',
    })
], PHPLinterUsedPractice);
exports.PHPLinterUsedPractice = PHPLinterUsedPractice;
//# sourceMappingURL=PHPLinterUsedPractice.js.map