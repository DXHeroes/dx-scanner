import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProjectComponentType } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';

@DxPractice({
  id: 'LanguageIndependent.DockerizationUsed',
  name: 'Use Docker',
  impact: PracticeImpact.small,
  suggestion: 'Use docker to create, deploy, and run applications easier by using containers.',
  reportOnlyOnce: true,
  url: 'https://dxkb.io/p/dockerizing',
})
export class DockerizationUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.type !== ProjectComponentType.Library;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexDocker = new RegExp(/dockerfile|docker-compose\.yml/, 'i');
    const dockerfiles = await ctx.fileInspector.scanFor(regexDocker, '/');
    const rootDockerfiles = await ctx.root.fileInspector.scanFor(regexDocker, '/', { shallow: true });
    if (dockerfiles.length > 0 || rootDockerfiles.length > 0) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
