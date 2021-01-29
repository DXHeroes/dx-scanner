"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESLintWithoutErrorsPractice = void 0;
const debug_1 = __importDefault(require("debug"));
const eslint_1 = require("eslint");
const js_yaml_1 = __importDefault(require("js-yaml"));
const lodash_1 = __importDefault(require("lodash"));
const nodePath = __importStar(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const model_1 = require("../../model");
const reporters_1 = require("../../reporters");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const PackageManagerUtils_1 = require("../utils/PackageManagerUtils");
let ESLintWithoutErrorsPractice = class ESLintWithoutErrorsPractice extends PracticeBase_1.PracticeBase {
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async runEslint(ctx, { fix } = { fix: false }) {
        var _a, _b, _c, _d;
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        let ignorePatterns = ['lib', 'build', 'dist'];
        let lintFilesPatterns = [`${ctx.projectComponent.path}`];
        if (ctx.config) {
            const config = ctx.config;
            ignorePatterns = ((_a = config.override) === null || _a === void 0 ? void 0 : _a.ignorePatterns.length) === 0 ? ignorePatterns : (_b = config.override) === null || _b === void 0 ? void 0 : _b.ignorePatterns;
            // get absolute paths for lint files patterns
            const lintFilesPatternsOverride = (_c = config.override) === null || _c === void 0 ? void 0 : _c.lintFilesPatterns.map((pattern) => {
                return `${ctx.projectComponent.path}/${pattern}`;
            });
            lintFilesPatterns = lodash_1.default.merge(lintFilesPatterns, lintFilesPatternsOverride);
        }
        const securityVulnerabilitiesPracticeDebug = debug_1.default('ESLintWithoutErrorsPractice');
        // Get the eslint config and ignore for a component.
        const eslintConfig = await ctx.fileInspector.scanFor(/\.eslintrc/, '/', { shallow: true });
        const eslintIgnore = await ctx.fileInspector.scanFor(/\.eslintignore/, '/', { shallow: true });
        let options = {
            fix,
            useEslintrc: false,
            errorOnUnmatchedPattern: true,
        };
        if (eslintConfig.length > 0) {
            let baseConfig, content;
            const packageManager = await PackageManagerUtils_1.PackageManagerUtils.getPackageManagerInstalled(ctx.fileInspector);
            if (packageManager === PackageManagerUtils_1.PackageManagerType.unknown) {
                securityVulnerabilitiesPracticeDebug('Cannot establish package-manager type, missing package-lock.json and yarn.lock or npm command not installed.');
                this.setData([]);
                return model_1.PracticeEvaluationResult.unknown;
            }
            shelljs_1.default.cd((_d = ctx.fileInspector) === null || _d === void 0 ? void 0 : _d.basePath);
            const npmCmd = 'npm install';
            const yarnCmd = 'yarn install';
            if (packageManager === PackageManagerUtils_1.PackageManagerType.yarn) {
                shelljs_1.default.exec(yarnCmd, { silent: true });
            }
            if (packageManager === PackageManagerUtils_1.PackageManagerType.npm) {
                shelljs_1.default.exec(npmCmd, { silent: true });
            }
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                baseConfig = require(nodePath.resolve(ctx.fileInspector.basePath, eslintConfig[0].path));
                const plugins = lodash_1.default.clone(baseConfig.plugins);
                lodash_1.default.unset(baseConfig, 'plugins');
                lodash_1.default.unset(baseConfig, 'extends');
                options = Object.assign(Object.assign({}, options), { baseConfig, overrideConfig: { plugins, ignorePatterns }, overrideConfigFile: eslintConfig[0].path, resolvePluginsRelativeTo: `${ctx.fileInspector.basePath}/node_modules` });
            }
            catch (error) {
                const eSLintWithoutErrorsPracticeDebug = debug_1.default('ESLintWithoutErrorsPractice');
                eSLintWithoutErrorsPracticeDebug(`Loading .eslintrc file failed with this error: ${error.stack}`);
                content = await ctx.fileInspector.readFile(eslintConfig[0].path);
                baseConfig = js_yaml_1.default.safeLoad(content);
            }
        }
        if (eslintIgnore.length > 0) {
            options = Object.assign(Object.assign({}, options), { ignorePath: eslintIgnore[0].path });
        }
        if (ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript) {
            options = Object.assign(Object.assign({}, options), { extensions: ['.ts'] });
        }
        if (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript) {
            options = Object.assign(Object.assign({}, options), { extensions: ['.js'] });
        }
        const cli = new eslint_1.ESLint(options);
        return cli.lintFiles(lintFilesPatterns);
    }
    async evaluate(ctx) {
        const report = await this.runEslint(ctx);
        if (!report || report === model_1.PracticeEvaluationResult.unknown) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const linterIssues = [];
        let errorCount = 0;
        for (const result of report) {
            if (result.errorCount > 0 || result.warningCount > 0) {
                for (const message of result.messages) {
                    errorCount += result.errorCount;
                    linterIssues.push({
                        filePath: `${result.filePath}(${message.line})(${message.column})`,
                        severity: message.severity === 2 ? reporters_1.LinterIssueSeverity.Error : reporters_1.LinterIssueSeverity.Warning,
                        url: `${result.filePath}#L${message.line}`,
                        type: message.message,
                    });
                }
            }
        }
        this.setData(linterIssues);
        if (errorCount === 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    async fix(ctx) {
        await this.runEslint(ctx, { fix: true });
    }
    setData(linterIssues) {
        this.data.statistics = { linterIssues };
    }
};
ESLintWithoutErrorsPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.ESLintWithoutErrorsPractice',
        name: 'ESLint Without Errors',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Use the ESLint correctly. You have some errors.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/linting',
        dependsOn: { practicing: ['JavaScript.ESLintUsed'] },
    })
], ESLintWithoutErrorsPractice);
exports.ESLintWithoutErrorsPractice = ESLintWithoutErrorsPractice;
//# sourceMappingURL=ESLintWithoutErrorsPractice.js.map