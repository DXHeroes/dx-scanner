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
exports.JSONReporter = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const lodash_1 = __importDefault(require("lodash"));
const util_1 = require("util");
let JSONReporter = class JSONReporter {
    constructor(argumentsProvider) {
        this.argumentsProvider = argumentsProvider;
    }
    async report(practicesAndComponents) {
        const reportString = this.buildReport(practicesAndComponents);
        console.log(util_1.inspect(reportString, { showHidden: false, depth: null }));
    }
    buildReport(practicesAndComponents) {
        const report = {
            uri: this.argumentsProvider.uri,
            components: [],
        };
        for (const pac of practicesAndComponents) {
            let component = lodash_1.default.find(report.components, { path: pac.component.path });
            if (!component) {
                const currentComponentReport = Object.assign(Object.assign({}, pac.component), { practices: [pac.practice] });
                report.components.push(currentComponentReport);
                component = currentComponentReport;
                continue;
            }
            component.practices.push(pac.practice);
        }
        return report;
    }
};
JSONReporter = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __metadata("design:paramtypes", [Object])
], JSONReporter);
exports.JSONReporter = JSONReporter;
//# sourceMappingURL=JSONReporter.js.map