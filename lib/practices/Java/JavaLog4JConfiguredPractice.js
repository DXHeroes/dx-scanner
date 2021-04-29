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
exports.JavaLog4JConfiguredPractice = void 0;
const ErrorFactory_1 = require("../../lib/errors/ErrorFactory");
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const xml2js = __importStar(require("xml2js"));
const properties = __importStar(require("properties"));
const js_yaml_1 = __importDefault(require("js-yaml"));
let JavaLog4JConfiguredPractice = class JavaLog4JConfiguredPractice {
    async isApplicable(ctx) {
        return ctx.projectComponent.language === model_1.ProgrammingLanguage.Java || ctx.projectComponent.language === model_1.ProgrammingLanguage.Kotlin;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const dotExtensions = new RegExp('.(xml|json|yaml|yml|properties)', 'i');
        const configurationFiles = await ctx.fileInspector.scanFor(dotExtensions, '/', { shallow: false });
        const configurationKeys = ['configuration', 'log4j:configuration', 'rootLogger', 'logger', 'loggers', 'properties', 'appender'];
        if (configurationFiles) {
            for (const file of configurationFiles) {
                if (file.baseName === 'log4j' || file.baseName === 'log4j2') {
                    const fileContents = await ctx.fileInspector.readFile(file.path);
                    let parsedContents;
                    try {
                        switch (file.extension) {
                            case '.xml':
                                parsedContents = await xml2js.parseStringPromise(fileContents);
                                break;
                            case '.json':
                                parsedContents = await JSON.parse(fileContents);
                                break;
                            case '.yaml':
                            case '.yml':
                                parsedContents = js_yaml_1.default.load(fileContents);
                                break;
                            case '.properties':
                                parsedContents = await properties.parse(fileContents, { namespaces: true });
                                break;
                            default:
                                throw ErrorFactory_1.ErrorFactory.newNotImplementedError(`Unsupported configuration extension.`);
                        }
                    }
                    catch (e) {
                        throw ErrorFactory_1.ErrorFactory.newInternalError(`Failed to parse Log4J configuration file ${file.baseName}.${file.extension} on: ${e}`);
                    }
                    for (const key of Object.keys(parsedContents)) {
                        if (configurationKeys.includes(key.toLowerCase())) {
                            return model_1.PracticeEvaluationResult.practicing;
                        }
                    }
                }
            }
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
};
JavaLog4JConfiguredPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.Log4JConfigured',
        name: 'Use Java Logger Configuration Files',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Configure your Log4J using an xml, json, yaml, properties files; or use in-code configuration',
        reportOnlyOnce: true,
        url: 'https://logging.apache.org/log4j/2.x/manual/configuration.html',
        dependsOn: { practicing: ['Java.LoggerUsedPractice'] },
    })
], JavaLog4JConfiguredPractice);
exports.JavaLog4JConfiguredPractice = JavaLog4JConfiguredPractice;
//# sourceMappingURL=JavaLog4JConfiguredPractice.js.map