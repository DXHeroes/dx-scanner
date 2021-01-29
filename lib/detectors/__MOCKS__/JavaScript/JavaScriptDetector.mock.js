"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptDetector = void 0;
const inversify_1 = require("inversify");
const model_1 = require("../../../model");
let JavaScriptDetector = class JavaScriptDetector {
    async detectLanguage() {
        return [{ language: model_1.ProgrammingLanguage.JavaScript, path: './javascript' }];
    }
};
JavaScriptDetector = __decorate([
    inversify_1.injectable()
], JavaScriptDetector);
exports.JavaScriptDetector = JavaScriptDetector;
//# sourceMappingURL=JavaScriptDetector.mock.js.map