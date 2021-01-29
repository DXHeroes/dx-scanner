"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptComponentDetector = void 0;
const inversify_1 = require("inversify");
const model_1 = require("../../model");
const types_1 = require("../../types");
let JavaScriptComponentDetector = class JavaScriptComponentDetector {
    constructor(packageInspector) {
        this.packageInspector = packageInspector;
    }
    async detectComponent(langAtPath) {
        const backendPackages = [
            'express',
            'koa',
            'hapi',
            'flatiron',
            'locomotive',
            'nodal',
            '@adonisjs/framework',
            'thinkjs',
            'sails',
            '@nestjs/core',
        ];
        const frontendPackages = ['webpack', 'jquery', 'gulp', 'grunt', 'browserify', 'babel'];
        let frontendOrBackend;
        if (this.packageInspector.hasOneOfPackages(backendPackages)) {
            frontendOrBackend = model_1.ProjectComponentPlatform.BackEnd;
        }
        if (this.packageInspector.hasOneOfPackages(frontendPackages)) {
            frontendOrBackend = model_1.ProjectComponentPlatform.FrontEnd;
        }
        return [
            {
                framework: model_1.ProjectComponentFramework.UNKNOWN,
                language: langAtPath.language,
                path: langAtPath.path,
                platform: frontendOrBackend ? frontendOrBackend : model_1.ProjectComponentPlatform.UNKNOWN,
                repositoryPath: undefined,
                type: frontendOrBackend ? model_1.ProjectComponentType.Application : model_1.ProjectComponentType.Library,
            },
        ];
    }
};
JavaScriptComponentDetector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IPackageInspector)),
    __metadata("design:paramtypes", [Object])
], JavaScriptComponentDetector);
exports.JavaScriptComponentDetector = JavaScriptComponentDetector;
//# sourceMappingURL=JavaScriptComponentDetector.js.map