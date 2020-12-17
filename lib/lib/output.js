"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleOutput = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("inversify");
let ConsoleOutput = class ConsoleOutput {
    taskStart(message, ...params) {
        // tslint:disable-next-line
        console.info('');
        // tslint:disable-next-line
        console.info('-----------------------');
        // tslint:disable-next-line
        console.info('▶️', message, ...params);
    }
    warning(message, ...params) {
        // tslint:disable-next-line
        console.warn('⚠️', message, ...params);
    }
    error(message, ...params) {
        // tslint:disable-next-line
        console.error('🛑', message, ...params);
        // tslint:disable-next-line
        console.info('-----------------------');
    }
    completed(message, ...params) {
        // tslint:disable-next-line
        console.log('✅', message, ...params);
        // tslint:disable-next-line
        console.info('-----------------------');
    }
    info(message, ...params) {
        // tslint:disable-next-line
        console.log(message, ...params);
    }
};
ConsoleOutput = __decorate([
    inversify_1.injectable()
], ConsoleOutput);
exports.ConsoleOutput = ConsoleOutput;
//# sourceMappingURL=output.js.map