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
exports.LanguageContext = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const ContextBase_1 = require("../ContextBase");
let LanguageContext = class LanguageContext extends ContextBase_1.ContextBase {
    constructor(languageAtPath, projectComponentDetectorFactory, projecComponentContextFactory, initableInspectors) {
        super();
        this.languageAtPath = languageAtPath;
        this.projectComponentDetectorFactory = projectComponentDetectorFactory;
        this.projecComponentContextFactory = projecComponentContextFactory;
        this.initableInspectors = initableInspectors;
    }
    async init() {
        await Promise.all(this.initableInspectors.map((initableInspector) => initableInspector.init()));
    }
    get path() {
        return this.languageAtPath.path;
    }
    get language() {
        return this.languageAtPath.language;
    }
    getProjectComponentDetectors() {
        if (!this.projectComponentDetectors) {
            this.projectComponentDetectors = this.projectComponentDetectorFactory(this.language);
        }
        return this.projectComponentDetectors;
    }
    getProjectComponentContext(component) {
        return this.projecComponentContextFactory(component);
    }
};
LanguageContext = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.LanguageAtPath)),
    __param(1, inversify_1.inject(types_1.Types.ProjectComponentDetectorFactory)),
    __param(2, inversify_1.inject(types_1.Types.ProjectComponentContextFactory)),
    __param(3, inversify_1.multiInject(types_1.Types.InitiableInspector)),
    __metadata("design:paramtypes", [Object, Function, Function, Array])
], LanguageContext);
exports.LanguageContext = LanguageContext;
//# sourceMappingURL=LanguageContext.js.map