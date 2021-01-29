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
exports.LockfileIsPresentPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PackageManagerUtils_1 = require("../utils/PackageManagerUtils");
const shelljs_1 = __importDefault(require("shelljs"));
let LockfileIsPresentPractice = class LockfileIsPresentPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexLockFile = new RegExp('lock', 'i');
        const files = await ctx.fileInspector.scanFor(regexLockFile, '/', { shallow: true });
        if (files.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    async fix() {
        const generateYarnLock = () => {
            shelljs_1.default.exec('yarn install');
        };
        const generateNpmLock = () => {
            shelljs_1.default.exec('npm i --package-lock-only');
        };
        const packageManager = PackageManagerUtils_1.PackageManagerUtils.packageManagerInstalled(PackageManagerUtils_1.PackageManagerType.yarn); // prefer Yarn
        if (packageManager === PackageManagerUtils_1.PackageManagerType.yarn)
            return generateYarnLock();
        if (packageManager === PackageManagerUtils_1.PackageManagerType.npm)
            return generateNpmLock();
    }
};
LockfileIsPresentPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.LockfileIsPresent',
        name: 'Create a Lockfile',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Commit a lockfile to git to have a reliable assembly across environments',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/lockfile',
    })
], LockfileIsPresentPractice);
exports.LockfileIsPresentPractice = LockfileIsPresentPractice;
//# sourceMappingURL=LockfileIsPresentPractice.js.map