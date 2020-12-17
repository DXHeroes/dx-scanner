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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeBase = void 0;
const errors_1 = require("../lib/errors");
const inversify_1 = require("inversify");
let PracticeBase = class PracticeBase {
    constructor() {
        this.data = {};
    }
    async isApplicable(ctx) {
        return true;
    }
    async evaluate(ctx) {
        throw errors_1.ErrorFactory.newInternalError('Method not implemented.');
    }
};
PracticeBase = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PracticeBase);
exports.PracticeBase = PracticeBase;
//# sourceMappingURL=PracticeBase.js.map