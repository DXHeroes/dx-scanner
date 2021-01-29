"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettierUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PackageManagerUtils_1 = require("../utils/PackageManagerUtils");
const prettier_default_config_1 = require("prettier-default-config");
let PrettierUsedPractice = class PrettierUsedPractice {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        if (ctx.packageInspector) {
            if (ctx.packageInspector.hasOneOfPackages(['prettier', 'prettier-eslint'])) {
                return model_1.PracticeEvaluationResult.practicing;
            }
            else {
                return model_1.PracticeEvaluationResult.notPracticing;
            }
        }
        return model_1.PracticeEvaluationResult.unknown;
    }
    async fix(ctx) {
        var _a;
        const inspector = ((_a = ctx.fileInspector) === null || _a === void 0 ? void 0 : _a.basePath) ? ctx.fileInspector : ctx.root.fileInspector;
        if (!inspector)
            return;
        // install prettier
        await PackageManagerUtils_1.PackageManagerUtils.installPackage(inspector, 'prettier', { dev: true });
        // create default config
        const prettierConfigPresent = async (inspector) => {
            const checks = await Promise.all([
                '.prettierrc',
                '.prettierrc.json',
                '.prettierrc.yaml',
                '.prettierrc.yml',
                '.prettierrc.js',
                'prettier.config.js',
                '.prettierrc.toml',
            ].map((name) => inspector.exists(name)));
            return checks.some(Boolean);
        };
        if (!(await prettierConfigPresent(inspector))) {
            const prettierConfig = JSON.stringify(prettier_default_config_1.defaultConfigFor('json'), null, 2);
            await inspector.writeFile('.prettierrc', prettierConfig);
        }
        // add npm script
        const packageJsonString = await inspector.readFile('package.json');
        const packageJson = JSON.parse(packageJsonString);
        if (!packageJson.scripts)
            packageJson.scripts = {};
        if (!Object.keys(packageJson.scripts).includes('format')) {
            packageJson.scripts.format = 'prettier --check "**/*.js"';
            await inspector.writeFile('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);
        }
    }
};
PrettierUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.PrettierUsed',
        name: 'Format your code automatically',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Use a tool for automated code formatting. For example, Prettier saves your time and energy and makes your code style consistent.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/linting',
    })
], PrettierUsedPractice);
exports.PrettierUsedPractice = PrettierUsedPractice;
//# sourceMappingURL=PrettierUsedPractice.js.map