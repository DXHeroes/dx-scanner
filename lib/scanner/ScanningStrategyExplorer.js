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
exports.ScanningStrategyExplorer = void 0;
const inversify_1 = require("inversify");
const promise_1 = __importDefault(require("simple-git/promise"));
const utils_1 = require("../detectors/utils");
const ScanningStrategyDetectorUtils_1 = require("../detectors/utils/ScanningStrategyDetectorUtils");
const services_1 = require("../services");
const types_1 = require("../types");
let ScanningStrategyExplorer = class ScanningStrategyExplorer {
    constructor(argumentsProvider) {
        this.determineRemote = async (path) => {
            const gitRepository = promise_1.default(path);
            // Doesn't use a git? => local
            const isRepository = await gitRepository.checkIsRepo();
            if (!isRepository) {
                return undefined;
            }
            // Uses git? Then determine remote type & url.
            const remotes = await gitRepository.getRemotes(true);
            if (remotes.length === 0) {
                return undefined;
            }
            // Read all remotes
            const originRemote = remotes.find((r) => r.name === 'origin');
            const remote = originRemote || remotes[0];
            return remote.refs.fetch;
        };
        this.argumentsProvider = argumentsProvider;
        this.d = utils_1.debugLog('ScanningStrategyExplorer');
    }
    async explore() {
        const path = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.normalizePath(this.argumentsProvider.uri);
        let remoteUrl;
        if (ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath(path)) {
            remoteUrl = await this.determineRemote(path);
        }
        else {
            remoteUrl = path;
        }
        if (!remoteUrl) {
            return { remoteUrl, host: undefined, protocol: undefined, baseUrl: undefined };
        }
        const parsedUrl = services_1.GitServiceUtils.parseUrl(remoteUrl);
        return {
            baseUrl: `${parsedUrl.protocol}://${parsedUrl.host}`,
            remoteUrl,
            host: parsedUrl.host,
            protocol: parsedUrl.protocol,
        };
    }
};
ScanningStrategyExplorer = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __metadata("design:paramtypes", [Object])
], ScanningStrategyExplorer);
exports.ScanningStrategyExplorer = ScanningStrategyExplorer;
//# sourceMappingURL=ScanningStrategyExplorer.js.map