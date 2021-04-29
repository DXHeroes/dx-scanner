"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitignoreCorrectlySetPracticeBase = void 0;
const model_1 = require("../../model");
const PracticeBase_1 = require("../PracticeBase");
const lodash_1 = __importDefault(require("lodash"));
/**
 * Base class for all GitignorePresent practices that provides most of the boilerplate needed to create such a practice.
 *
 * The deriving class should at minimum fill out the appropriate `applicableLanguages` and `ruleChecks`.
 * It should also override the `evaluate` method, call the parent method (the one implemented here) and
 * check the return value for `PracticeEvaluationResult.notPracticing` and if so it should fill out its
 * `this.data` with the correct report imformation.
 *
 * @see JsGitignoreCorrectlySetPractice
 */
class GitignoreCorrectlySetPracticeBase extends PracticeBase_1.PracticeBase {
    /**
     * Initializes a new gitignore practice base.
     *
     * @param applicableLanguages list of programming languages for which this practice is applicable
     * @param ruleChecks list of checked rules, @see GitignorePresentPracticeBase::evaluate
     */
    constructor() {
        super();
        this.applicableLanguages = [];
        this.ruleChecks = [];
    }
    /**
     * Reads and parses the `.gitignore` file in the current path.
     *
     * @returns an object where `raw` is the raw value of the file and `rules` is a list of non-empty non-comment lines
     */
    static async parseGitignore(fileInspector) {
        const raw = await fileInspector.readFile('.gitignore');
        const rules = raw.split('/\r?\n/').filter((line) => !line.startsWith('#') && line.trim() !== '');
        return {
            raw,
            rules,
        };
    }
    /**
     * Evaluates all `ruleChecks` over the `gitignore` rules list and returns a list of fixes to be applied.
     */
    static evaluateChecks(ctx, ruleChecks, gitignoreRules) {
        return ruleChecks
            .map((rule) => {
            for (const grule of gitignoreRules) {
                if ('regex' in rule) {
                    if (!rule.regex.test(grule)) {
                        return rule.fix;
                    }
                }
                else {
                    const match = rule.check(ctx, grule);
                    if (match !== undefined) {
                        return match;
                    }
                }
            }
            return undefined;
        })
            .filter(lodash_1.default.isString);
    }
    /**
     * Returns `true` if `this.applicableLanguages` contains the language of the current component.
     */
    async isApplicable(ctx) {
        return this.applicableLanguages.includes(ctx.projectComponent.language);
    }
    static async checkFileInspector(ctx) {
        var _a;
        let inspector;
        if (await ((_a = ctx.fileInspector) === null || _a === void 0 ? void 0 : _a.exists('.gitignore'))) {
            inspector = ctx.fileInspector;
        }
        else {
            //gitignore correctly set practice depends on gitignore is present practice - so we know there is a gitignore somewhere
            inspector = ctx.root.fileInspector;
        }
        // if (!inspector) {
        // TODO: Log this?
        // }
        return inspector;
    }
    /**
     * Evaluates the current component by checking whether each `check` in `this.ruleChecks` matches at least one rule in the parsed `.gitignore` rules.
     */
    async evaluate(ctx) {
        const fileInspector = await GitignoreCorrectlySetPracticeBase.checkFileInspector(ctx);
        if (!fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        this.gitignore = await GitignoreCorrectlySetPracticeBase.parseGitignore(fileInspector);
        this.fixes = GitignoreCorrectlySetPracticeBase.evaluateChecks(ctx, this.ruleChecks, this.gitignore.rules);
        // Practicing exactly when there are no fixes
        if (this.fixes.length === 0) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        this.setData();
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    /**
     * Fixes the `.gitignore` file by collecting `fix` fields from `this.ruleChecks` which didn't pass the check and appends them at the end of the file.
     */
    async fix(ctx) {
        var _a;
        const fileInspector = await GitignoreCorrectlySetPracticeBase.checkFileInspector(ctx);
        if (!fileInspector) {
            return;
        }
        if (this.fixes && this.fixes.length > 0) {
            let fixesString = this.fixes.join('\n');
            if (fixesString.length > 0) {
                fixesString = '\n# added by `dx-scanner --fix`\n' + fixesString + '\n';
            }
            // TODO: Fix the race condition when two or more components are at the same path
            await fileInspector.writeFile('.gitignore', `${((_a = this.gitignore) === null || _a === void 0 ? void 0 : _a.raw) || ''}${fixesString}`);
        }
    }
}
exports.GitignoreCorrectlySetPracticeBase = GitignoreCorrectlySetPracticeBase;
//# sourceMappingURL=GitignoreCorrectlySetPracticeBase.js.map