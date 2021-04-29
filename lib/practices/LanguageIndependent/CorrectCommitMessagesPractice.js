"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrectCommitMessagesPractice = void 0;
const lint_1 = __importDefault(require("@commitlint/lint"));
const config_conventional_1 = __importDefault(require("@commitlint/config-conventional"));
const model_1 = require("../../model");
const GitServiceUtils_1 = require("../../services/git/GitServiceUtils");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
const errors_1 = require("../../lib/errors");
let CorrectCommitMessagesPractice = class CorrectCommitMessagesPractice extends PracticeBase_1.PracticeBase {
    constructor() {
        super(...arguments);
        this.relevantCommitCount = 30;
    }
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (!ctx.collaborationInspector) {
            throw errors_1.ErrorFactory.newAuthorizationError('You probably provided bad acess token to your repository or did not provided at all.');
        }
        const repoName = GitServiceUtils_1.GitServiceUtils.getRepoName(ctx.projectComponent.repositoryPath, ctx.projectComponent.path);
        const ownerAndRepoName = GitServiceUtils_1.GitServiceUtils.parseUrl(repoName);
        const repoCommits = await ctx.collaborationInspector.listRepoCommits(ownerAndRepoName.owner, ownerAndRepoName.repoName, {
            pagination: { perPage: this.relevantCommitCount },
        });
        const messages = repoCommits.items.map((val) => val.message);
        let invalidMessages = await Promise.all(messages.map(async (m) => await lint_1.default(m, config_conventional_1.default.rules)));
        invalidMessages = invalidMessages.filter((m) => !m.valid);
        // save data for detailed report
        this.data.details = [
            {
                type: ReporterData_1.ReportDetailType.table,
                headers: ['Commit Message', 'Problems'],
                data: invalidMessages.map((im) => {
                    return {
                        msg: im.input,
                        problems: im.warnings
                            .map((w) => w.message)
                            .concat(im.errors.map((e) => e.message))
                            .join('; '),
                    };
                }),
            },
        ];
        // return practicing, if more than 80% of commits are correct
        return invalidMessages.length / repoCommits.items.length < 0.8
            ? model_1.PracticeEvaluationResult.practicing
            : model_1.PracticeEvaluationResult.notPracticing;
    }
};
CorrectCommitMessagesPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.CorrectCommitMessages',
        name: 'Write Commit Messages by Convention',
        impact: model_1.PracticeImpact.small,
        suggestion: 'A commit message should be written in a simple understandable language. Use the conventional structure. See the website.',
        reportOnlyOnce: true,
        url: 'https://www.conventionalcommits.org/',
    })
], CorrectCommitMessagesPractice);
exports.CorrectCommitMessagesPractice = CorrectCommitMessagesPractice;
//# sourceMappingURL=CorrectCommitMessagesPractice.js.map