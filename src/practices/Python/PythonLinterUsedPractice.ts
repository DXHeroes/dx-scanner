import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'Python.LinterUsedPractice',
  name: 'Use a Python Linter Dependency',
  impact: PracticeImpact.medium,
  suggestion: 'Use a linter for clean and error-free development experience.',
  reportOnlyOnce: true,
  url: 'https://developerexperience.io/practices/linting',
})
export class PythonLinterUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Python;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.packageInspector) {
      return PracticeEvaluationResult.unknown;
    }

    if (ctx.packageInspector.hasOneOfPackages(['pylint', 'pyflakes', 'flake8', 'pycodestyle'])) {
      return PracticeEvaluationResult.practicing;
    }
    return PracticeEvaluationResult.notPracticing;
  }
}
