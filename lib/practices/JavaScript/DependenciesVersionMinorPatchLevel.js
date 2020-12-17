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
exports.DependenciesVersionMinorPatchLevelPractice = void 0;
const lodash_1 = require("lodash");
const npm_check_updates_1 = __importDefault(require("npm-check-updates"));
const PackageInspectorBase_1 = require("../../inspectors/package/PackageInspectorBase");
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const DependenciesVersionEvaluationUtils_1 = require("../utils/DependenciesVersionEvaluationUtils");
const DependenciesVersionMajorLevel_1 = require("./DependenciesVersionMajorLevel");
let DependenciesVersionMinorPatchLevelPractice = class DependenciesVersionMinorPatchLevelPractice extends DependenciesVersionMajorLevel_1.DependenciesVersionMajorLevelPractice {
    constructor() {
        super(...arguments);
        this.patchLevelPkgs = [];
        this.minorLevelPkgs = [];
    }
    async isApplicable(ctx) {
        return (ctx.projectComponent.language === model_1.ProgrammingLanguage.JavaScript || ctx.projectComponent.language === model_1.ProgrammingLanguage.TypeScript);
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.packageInspector || !ctx.packageInspector.packages) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const pkgs = ctx.packageInspector.packages;
        const result = await this.runNcu(pkgs);
        const patchLevelPkgs = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, PackageInspectorBase_1.SemverLevel.patch, pkgs);
        const minorLevelPkgs = DependenciesVersionEvaluationUtils_1.DependenciesVersionEvaluationUtils.packagesToBeUpdated(result, PackageInspectorBase_1.SemverLevel.minor, pkgs);
        this.patchLevelPkgs = patchLevelPkgs;
        this.minorLevelPkgs = minorLevelPkgs;
        this.setData(lodash_1.flatten([patchLevelPkgs, minorLevelPkgs]));
        if (patchLevelPkgs.length > 0 || minorLevelPkgs.length > 0) {
            return model_1.PracticeEvaluationResult.notPracticing;
        }
        return model_1.PracticeEvaluationResult.practicing;
    }
    async fix() {
        const packagesToUpdate = this.patchLevelPkgs
            .map((p) => p.library)
            .concat(this.minorLevelPkgs.map((p) => p.library))
            .join(',');
        // this should not happen, so just to be on the safer side
        if (packagesToUpdate === '')
            return;
        await npm_check_updates_1.default.run({ filter: packagesToUpdate, upgrade: true });
    }
};
DependenciesVersionMinorPatchLevelPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'JavaScript.DependenciesVersionMinorPatchLevel',
        name: 'Update Dependencies of Minor and Patch Level',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Keep the dependencies updated to eliminate security concerns and compatibility issues. Use, for example, npm-check-updates.',
        reportOnlyOnce: true,
        url: 'https://dxkb.io/p/updating-the-dependencies',
    })
], DependenciesVersionMinorPatchLevelPractice);
exports.DependenciesVersionMinorPatchLevelPractice = DependenciesVersionMinorPatchLevelPractice;
//# sourceMappingURL=DependenciesVersionMinorPatchLevel.js.map