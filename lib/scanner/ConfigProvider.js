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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigProvider = void 0;
const inversify_1 = require("inversify");
const js_yaml_1 = __importDefault(require("js-yaml"));
const lodash_1 = __importDefault(require("lodash"));
const types_1 = require("../types");
let ConfigProvider = class ConfigProvider {
    constructor(fileInspector) {
        this.fileInspector = fileInspector;
        this.config = undefined;
    }
    async init() {
        const regexConfigFile = new RegExp('dxscannerrc.', 'i');
        const configFileMetadata = await this.fileInspector.scanFor(regexConfigFile, '/', { shallow: true });
        if (configFileMetadata.length === 0) {
            return undefined;
        }
        const configFile = configFileMetadata[0];
        let parsedContent;
        const content = await this.fileInspector.readFile(configFile.path);
        if (configFile.extension === '.json' || configFile.extension === '') {
            parsedContent = JSON.parse(content);
        }
        if (configFile.extension === '.yml' || configFile.extension === '.yaml') {
            parsedContent = js_yaml_1.default.safeLoad(content);
        }
        this.config = parsedContent;
    }
    getOverriddenPractice(practiceId) {
        const practiceConfig = lodash_1.default.get(this.config, ['practices', practiceId]);
        if (!practiceConfig)
            return undefined;
        if (typeof practiceConfig !== 'string' && practiceConfig !== undefined) {
            return { impact: practiceConfig.impact, fix: practiceConfig.fix, override: practiceConfig.override };
        }
        return {
            impact: practiceConfig,
        };
    }
};
ConfigProvider = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], ConfigProvider);
exports.ConfigProvider = ConfigProvider;
//# sourceMappingURL=ConfigProvider.js.map