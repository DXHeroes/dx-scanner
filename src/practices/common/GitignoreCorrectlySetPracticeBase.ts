import { FixerContext } from '../../contexts/fixer/FixerContext';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { IFileInspector } from '../../inspectors';
import { PracticeEvaluationResult, ProgrammingLanguage } from '../../model';
import { PracticeBase } from '../PracticeBase';
import _ from 'lodash';

export type RuleCheck =
  | {
      /** Regex to check whether the rule matches. */
      regex: RegExp;
      /** A string that is appended to the `.gitignore` file to fix this check. */
      fix: string;
    }
  | {
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
export abstract class GitignoreCorrectlySetPracticeBase extends PracticeBase {
  protected applicableLanguages: ProgrammingLanguage[];
  protected ruleChecks: RuleCheck[];

  protected gitignore: { raw: string; rules: string[] } | undefined;
  protected fixes: string[] | undefined;

  /**
   * Initializes a new gitignore practice base.
   *
   * @param applicableLanguages list of programming languages for which this practice is applicable
   * @param ruleChecks list of checked rules, @see GitignorePresentPracticeBase::evaluate
   */
  protected constructor() {
    super();

    this.applicableLanguages = [];
    this.ruleChecks = [];
  }

  /**
   * Reads and parses the `.gitignore` file in the current path.
   *
   * @returns an object where `raw` is the raw value of the file and `rules` is a list of non-empty non-comment lines
   */
  protected static async parseGitignore(fileInspector: IFileInspector): Promise<{ raw: string; rules: string[] }> {
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
  protected static evaluateChecks(ctx: PracticeContext, ruleChecks: RuleCheck[], gitignoreRules: string[]): string[] {
    return ruleChecks
      .map((rule) => {
        for (const grule of gitignoreRules) {
          if ('regex' in rule) {
            if (!rule.regex.test(grule)) {
              return rule.fix;
            }
          } else {
            const match = rule.check(ctx, grule);
            if (match !== undefined) {
              return match;
            }
          }
        }

        return undefined;
      })
      .filter(_.isString);
  }

  /**
   * Returns `true` if `this.applicableLanguages` contains the language of the current component.
   */
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return this.applicableLanguages.includes(ctx.projectComponent.language);
  }

  protected static async checkFileInspector(ctx: PracticeContext): Promise<IFileInspector | undefined> {
    let inspector;
    if (await ctx.fileInspector?.exists('.gitignore')) {
      inspector = ctx.fileInspector;
    } else {
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
  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    const fileInspector = await GitignoreCorrectlySetPracticeBase.checkFileInspector(ctx);
    if (!fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    this.gitignore = await GitignoreCorrectlySetPracticeBase.parseGitignore(fileInspector);
    this.fixes = GitignoreCorrectlySetPracticeBase.evaluateChecks(ctx, this.ruleChecks, this.gitignore.rules);

    // Practicing exactly when there are no fixes
    if (this.fixes.length === 0) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  protected abstract setData(): void;

  /**
   * Fixes the `.gitignore` file by collecting `fix` fields from `this.ruleChecks` which didn't pass the check and appends them at the end of the file.
   */
  async fix(ctx: FixerContext) {
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
      await fileInspector.writeFile('.gitignore', `${this.gitignore?.raw || ''}${fixesString}`);
    }
  }
}
