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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaLanguageDetector = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const model_1 = require("../../model");
const utils_1 = require("../utils");
const nodePath = __importStar(require("path"));
const lodash_1 = require("lodash");
let JavaLanguageDetector = class JavaLanguageDetector {
    constructor(fileInspector) {
        this.fileInspector = fileInspector;
    }
    async detectLanguage() {
        const result = [];
        let packageFiles = await this.fileInspector.scanFor(utils_1.fileNameRegExp('pom.xml'), '/');
        const isMaven = packageFiles.length > 0;
        const ktFiles = await this.fileInspector.scanFor(utils_1.fileExtensionRegExp(['kt', 'kts']), '/');
        const hasKtFiles = ktFiles.length > 0;
        if (!isMaven) {
            packageFiles = await this.fileInspector.scanFor(utils_1.fileNameRegExp(hasKtFiles ? 'build.gradle(.kts)?' : 'build.gradle'), '/');
        }
        if (packageFiles.length > 0) {
            for (const path of packageFiles.map((file) => nodePath.dirname(file.path))) {
                result.push({ language: hasKtFiles ? model_1.ProgrammingLanguage.Kotlin : model_1.ProgrammingLanguage.Java, path });
            }
        }
        else {
            const javaFiles = await this.fileInspector.scanFor(utils_1.fileExtensionRegExp(['java']), '/');
            if (javaFiles.length === 0 && ktFiles.length === 0) {
                return result;
            }
            const javaOrKtFiles = javaFiles.concat(ktFiles);
            const dirsWithProjects = lodash_1.uniq(javaOrKtFiles.map((f) => nodePath.dirname(f.path)));
            const commonPath = utils_1.sharedSubpath(dirsWithProjects);
            result.push({ language: hasKtFiles ? model_1.ProgrammingLanguage.Kotlin : model_1.ProgrammingLanguage.Java, path: commonPath });
        }
        return result;
    }
};
JavaLanguageDetector = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], JavaLanguageDetector);
exports.JavaLanguageDetector = JavaLanguageDetector;
//# sourceMappingURL=JavaLanguageDetector.js.map