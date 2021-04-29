import { FixerContext } from '../../contexts/fixer/FixerContext';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { IFileInspector } from '../../inspectors';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { PracticeBase } from '../PracticeBase';
export declare type RuleCheck = {
    /** Regex to check whether the rule matches. */
    regex: RegExp;
    /** A string that is appended to the `.gitignore` file to fix this check. */
    fix: string;
} | {
    /** A closure which either returns `undefined` or the fix value. */
    check(ctx: PracticeContext, value: string): string | undefined;
};
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
export declare abstract class GitignoreCorrectlySetPracticeBase extends PracticeBase {
    protected applicableLanguages: ProgrammingLanguage[];
    protected ruleChecks: RuleCheck[];
    protected gitignore: {
        raw: string;
        rules: string[];
    } | undefined;
    protected fixes: string[] | undefined;
    /**
     * Initializes a new gitignore practice base.
     *
     * @param applicableLanguages list of programming languages for which this practice is applicable
     * @param ruleChecks list of checked rules, @see GitignorePresentPracticeBase::evaluate
     */
    protected constructor();
    /**
     * Reads and parses the `.gitignore` file in the current path.
     *
     * @returns an object where `raw` is the raw value of the file and `rules` is a list of non-empty non-comment lines
     */
    protected static parseGitignore(fileInspector: IFileInspector): Promise<{
        raw: string;
        rules: string[];
    }>;
    /**
     * Evaluates all `ruleChecks` over the `gitignore` rules list and returns a list of fixes to be applied.
     */
    protected static evaluateChecks(ctx: PracticeContext, ruleChecks: RuleCheck[], gitignoreRules: string[]): string[];
    /**
     * Returns `true` if `this.applicableLanguages` contains the language of the current component.
     */
    isApplicable(ctx: PracticeContext): Promise<boolean>;
    protected static checkFileInspector(ctx: PracticeContext): Promise<IFileInspector | undefined>;
    /**
     * Evaluates the current component by checking whether each `check` in `this.ruleChecks` matches at least one rule in the parsed `.gitignore` rules.
     */
    evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;
    protected abstract setData(): void;
    /**
     * Fixes the `.gitignore` file by collecting `fix` fields from `this.ruleChecks` which didn't pass the check and appends them at the end of the file.
     */
    fix(ctx: FixerContext): Promise<void>;
}
//# sourceMappingURL=GitignoreCorrectlySetPracticeBase.d.ts.map