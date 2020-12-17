"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseIsPresentPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const yeoman_environment_1 = __importDefault(require("yeoman-environment"));
const yeoman_gen_run_1 = require("yeoman-gen-run");
const cli_ux_1 = __importDefault(require("cli-ux"));
const IScanningStrategy_1 = require("../../detectors/IScanningStrategy");
const env = yeoman_environment_1.default.createEnv(undefined, { console });
env.register(require.resolve('generator-license'), 'license');
let LicenseIsPresentPractice = class LicenseIsPresentPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexLicense = new RegExp('license', 'i');
        const files = await ctx.fileInspector.scanFor(regexLicense, '/', { shallow: true });
        const rootFiles = await ctx.root.fileInspector.scanFor(regexLicense, '/', { shallow: true });
        if (files.length > 0 || rootFiles.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    getDefaultLicense(ctx) {
        var _a, _b;
        if (ctx.config && ((_a = ctx.config.override) === null || _a === void 0 ? void 0 : _a.defaultLicense)) {
            return ctx.config.override.defaultLicense;
        }
        else if (((_b = ctx.scanningStrategy) === null || _b === void 0 ? void 0 : _b.accessType) === IScanningStrategy_1.AccessType.private) {
            return 'UNLICENSED';
        }
        else {
            // public or unknown repo
            return 'MIT';
        }
    }
    async fix(ctx) {
        var _a;
        if ((_a = ctx.argumentsProvider) === null || _a === void 0 ? void 0 : _a.ci) {
            const license = this.getDefaultLicense(ctx);
            await yeoman_gen_run_1.runGenerator('license', {
                answers: { license, options: { nolog: true } },
            });
        }
        else {
            await cli_ux_1.default.action.pauseAsync(() => new Promise((resolve) => {
                env.run('license', () => {
                    resolve();
                });
            }));
        }
    }
};
LicenseIsPresentPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.LicenseIsPresent',
        name: 'Create a License File',
        impact: model_1.PracticeImpact.medium,
        suggestion: 'Add a license to your repository to let others know what they can and can not do with your code.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/license-in-repository',
    })
], LicenseIsPresentPractice);
exports.LicenseIsPresentPractice = LicenseIsPresentPractice;
//# sourceMappingURL=LicenseIsPresentPractice.js.map