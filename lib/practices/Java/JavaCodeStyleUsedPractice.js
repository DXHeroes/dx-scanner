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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaCodeStyleUsedPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const xml2js = __importStar(require("xml2js"));
let JavaCodeStyleUsedPractice = class JavaCodeStyleUsedPractice {
    async isApplicable(ctx) {
        // note: these styles do not apply to Kotlin
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.packageInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        // java code styles
        if (ctx.packageInspector.hasOneOfPackages([
            'com.github.sherter.googlejavaformatgradleplugin:google-java-format-gradle-plugin',
            'com.google.googlejavaformat:google-java-format',
            'io.spring.javaformat:spring-javaformat-gradle-plugin',
        ])) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        const dotXml = new RegExp('.(xml)', 'i');
        const xmlFiles = await ctx.fileInspector.scanFor(dotXml, '/', { shallow: false });
        const codeStyleKeys = ['codestylesettings', 'codestyle', 'code_scheme'];
        if (xmlFiles) {
            for (const file of xmlFiles) {
                if (file.baseName !== 'pom') {
                    const fileContents = await ctx.fileInspector.readFile(file.path);
                    const parsedContents = await xml2js.parseStringPromise(fileContents);
                    for (const key of Object.keys(parsedContents)) {
                        if (codeStyleKeys.includes(key)) {
                            return model_1.PracticeEvaluationResult.practicing;
                        }
                    }
                }
            }
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaCodeStyleUsedPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.CodeStyleUsedPractice',
        name: 'Use Java Code Styles',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Use code style settings file for repository to apply code conventions for everyone in your team.',
        reportOnlyOnce: true,
        url: 'https://google.github.io/styleguide/javaguide.html',
    })
], JavaCodeStyleUsedPractice);
exports.JavaCodeStyleUsedPractice = JavaCodeStyleUsedPractice;
//# sourceMappingURL=JavaCodeStyleUsedPractice.js.map