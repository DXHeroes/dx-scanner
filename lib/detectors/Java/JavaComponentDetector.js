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
exports.JavaComponentDetector = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const model_1 = require("../../model");
let JavaComponentDetector = class JavaComponentDetector {
    constructor(packageInspector) {
        this.packageInspector = packageInspector;
    }
    async detectComponent(langAtPath) {
        return [
            {
                framework: model_1.ProjectComponentFramework.UNKNOWN,
                language: langAtPath.language,
                path: langAtPath.path,
                platform: model_1.ProjectComponentPlatform.BackEnd,
                repositoryPath: undefined,
                type: model_1.ProjectComponentType.Application,
            },
        ];
    }
};
JavaComponentDetector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IPackageInspector)),
    __metadata("design:paramtypes", [Object])
], JavaComponentDetector);
exports.JavaComponentDetector = JavaComponentDetector;
//# sourceMappingURL=JavaComponentDetector.js.map