import { PracticeEvaluationResult } from '../model';
import { PracticeContext } from '../contexts/practice/PracticeContext';
import { ReportTable, ReportText } from '../reporters/ReporterData';
import { FixerContext } from '../contexts/fixer/FixerContext';
import { SecurityIssueDto } from '..';
import { SecurityIssueSummaryDto, UpdatedDependencyDto, LinterIssueDto } from '../reporters';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface IPractice<T extends {} = {}> {
  data?: Partial<T> & PracticeData;

  /**
   * Returns true if this practice is applicable for the given project component
   *
   * Example: If the practice is strictly for JavaScript, this method should return only true
   * if the component is written in JavaScript.
   *
   * @todo for consideration: Should we make this synchronous to prevent people to do async (expensive) checks here?
   * I think, the logic in this method should be mostly straightforward and use only already known information/ (no network calls)
   *
   * @param ctx Context used for evaluation.
   */
  isApplicable(ctx: PracticeContext): Promise<boolean>;

  /**
   * Evaluates whether the practice is being used in the given component.
   * @param ctx Context used for evaluation.
   */
  evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult>;

  /**
   * Tries to fix the problem being checked by this practice
   * @param ctx Context used for fixing
   */
  fix?(ctx: FixerContext): Promise<void>;
}

export type PracticeData = {
  details?: PracticeDetail[];
  statistics?: Statistics;
};

export type PracticeDetail = ReportTable | ReportText;

export type Statistics = {
  securityIssues?: {
    issues: SecurityIssueDto[];
    summary: SecurityIssueSummaryDto | undefined;
  };
  updatedDependencies?: UpdatedDependencyDto[];
  linterIssues?: LinterIssueDto[];
};
