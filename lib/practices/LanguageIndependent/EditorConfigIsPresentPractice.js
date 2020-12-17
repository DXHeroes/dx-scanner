"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorConfigIsPresentPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const editorConfigTemplate = `root = true

[*]
end_of_line = lf
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
`;
let EditorConfigIsPresentPractice = class EditorConfigIsPresentPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexEditorcfg = new RegExp('.editorconfig', 'i');
        const files = await ctx.fileInspector.scanFor(regexEditorcfg, '/', { shallow: true });
        const rootFiles = await ctx.root.fileInspector.scanFor(regexEditorcfg, '/', { shallow: true });
        if (files.length > 0 || rootFiles.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    async fix(ctx) {
        var _a, _b, _c, _d;
        if ((_a = ctx.fileInspector) === null || _a === void 0 ? void 0 : _a.basePath) {
            await ctx.fileInspector.writeFile('.editorconfig', editorConfigTemplate);
        }
        else {
            await ((_b = ctx.root.fileInspector) === null || _b === void 0 ? void 0 : _b.writeFile('.editorconfig', editorConfigTemplate));
        }
        (_c = ctx.fileInspector) === null || _c === void 0 ? void 0 : _c.purgeCache();
        (_d = ctx.root.fileInspector) === null || _d === void 0 ? void 0 : _d.purgeCache();
    }
};
EditorConfigIsPresentPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.EditorConfigIsPresent',
        name: 'Use .editorconfig',
        impact: model_1.PracticeImpact.small,
        suggestion: 'Add .editorconfig to your repository to define and maintain consistent coding styles between different editions and IDEs.',
        reportOnlyOnce: true,
        url: 'https://editorconfig.org/',
    })
], EditorConfigIsPresentPractice);
exports.EditorConfigIsPresentPractice = EditorConfigIsPresentPractice;
//# sourceMappingURL=EditorConfigIsPresentPractice.js.map