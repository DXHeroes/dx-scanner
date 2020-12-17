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
exports.GitignoreIsPresentPractice = void 0;
const cli_ux_1 = __importDefault(require("cli-ux"));
const fs_1 = __importStar(require("fs"));
const gitignore_1 = __importDefault(require("gitignore"));
const inquirer_1 = __importDefault(require("inquirer"));
const os_1 = __importDefault(require("os"));
const util_1 = require("util");
const uuid_1 = require("uuid");
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const noop = () => undefined;
let GitignoreIsPresentPractice = class GitignoreIsPresentPractice {
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector || !ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexGitignore = new RegExp('.gitignore', 'i');
        const files = await ctx.fileInspector.scanFor(regexGitignore, '/', { shallow: true });
        const rootFiles = await ctx.root.fileInspector.scanFor(regexGitignore, '/', { shallow: true });
        if (files.length > 0 || rootFiles.length > 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    async fix(ctx) {
        var _a, _b;
        // do necessary checks
        const inspector = ((_a = ctx.fileInspector) === null || _a === void 0 ? void 0 : _a.basePath) ? ctx.fileInspector : ctx.root.fileInspector;
        if (!inspector)
            return;
        const availableTypes = await util_1.promisify(gitignore_1.default.getTypes)();
        if (!availableTypes)
            return;
        // get the gitignore type
        let type;
        if (availableTypes.includes(ctx.projectComponent.language)) {
            type = ctx.projectComponent.language;
        }
        else if (!((_b = ctx.argumentsProvider) === null || _b === void 0 ? void 0 : _b.ci)) {
            // get type from user
            const name = 'Pick a gitignore template';
            type = (await cli_ux_1.default.action.pauseAsync(() => inquirer_1.default.prompt({ name, type: 'list', choices: availableTypes })))[name];
        }
        else {
            return;
        }
        // download data to tmp file
        const tmpFilePath = `${os_1.default.tmpdir()}/${uuid_1.v4()}`;
        const writeTo = fs_1.default.createWriteStream(tmpFilePath);
        await new Promise((resolve) => {
            writeTo.on('finish', resolve); // continue once the write is finished
            gitignore_1.default.writeFile({ type: type, file: writeTo }, noop);
        });
        // move data to gitignore file
        const data = fs_1.default.readFileSync(tmpFilePath, 'utf8');
        await inspector.writeFile('.gitignore', data);
        await util_1.promisify(fs_1.unlink)(tmpFilePath);
    }
};
GitignoreIsPresentPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.GitignoreIsPresent',
        name: 'Create a .gitignore',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Add .gitignore to your directory. .gitignore allows you to ignore files, such as editor backup files, build products or local configuration overrides that you never want to commit into a repository.',
        reportOnlyOnce: true,
        url: 'https://git-scm.com/docs/gitignore',
    })
], GitignoreIsPresentPractice);
exports.GitignoreIsPresentPractice = GitignoreIsPresentPractice;
//# sourceMappingURL=GitignoreIsPresentPractice.js.map