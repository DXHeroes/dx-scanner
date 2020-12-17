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
exports.DiscoveryContext = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const ContextBase_1 = require("../ContextBase");
const errors_1 = require("../../lib/errors");
const detectors_1 = require("../../detectors");
let DiscoveryContext = class DiscoveryContext extends ContextBase_1.ContextBase {
    constructor(scanningStrategyDetector, scannerContextFactory) {
        super();
        this.scanningStrategyDetector = scanningStrategyDetector;
        this.scannerContextFactory = scannerContextFactory;
    }
    async init() {
        throw errors_1.ErrorFactory.newNotImplementedError();
    }
    getScanningContext(scanningStrategy) {
        return this.scannerContextFactory(scanningStrategy);
    }
};
DiscoveryContext = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(detectors_1.ScanningStrategyDetector)),
    __param(1, inversify_1.inject(types_1.Types.ScannerContextFactory)),
    __metadata("design:paramtypes", [detectors_1.ScanningStrategyDetector, Function])
], DiscoveryContext);
exports.DiscoveryContext = DiscoveryContext;
//# sourceMappingURL=DiscoveryContext.js.map