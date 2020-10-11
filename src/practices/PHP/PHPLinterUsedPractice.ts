import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { IPractice } from '../IPractice';

@DxPractice({
  id: 'PHP.LinterUsed',
  name: 'Use Linter',
  impact: PracticeImpact.medium,
  suggestion: 'Use Linter to catch dangerous code constructs.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/linting',
})
export class PHPLinterUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return (
      ctx.projectComponent.language === ProgrammingLanguage.PHP
    );
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (ctx.packageInspector) {
      const phpLinters = [
        'php -l',
        'phplint',
        'phpcs',
        'php-cs-fixer',
        'phpmd',
        'phpstan'
      ];
      if (ctx.packageInspector.hasOneOfPackages(phpLinters)) {
        return PracticeEvaluationResult.practicing;
      } else {
        return PracticeEvaluationResult.notPracticing;
      }
    }
    return PracticeEvaluationResult.unknown;
  }
}
