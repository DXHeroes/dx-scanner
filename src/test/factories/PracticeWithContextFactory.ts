import { PracticeWithContextForReporter } from '../../reporters/IReporter';
import {
  ProgrammingLanguage,
  ProjectComponentFramework,
  ProjectComponentType,
  ProjectComponentPlatform,
  PracticeImpact,
  PracticeEvaluationResult,
} from '../../model';
import { DeepPartial } from '../../lib/deepPartial';
import _ from 'lodash';
import path from 'path';

export const practiceWithContextFactory = (
  practiceWithContext: DeepPartial<PracticeWithContextForReporter> = {},
): PracticeWithContextForReporter => {
  return _.merge(
    {
      component: {
        repositoryPath: path.resolve('./'),
        path: path.resolve('./'),
        language: ProgrammingLanguage.JavaScript,
        framework: ProjectComponentFramework.UNKNOWN,
        type: ProjectComponentType.UNKNOWN,
        platform: ProjectComponentPlatform.UNKNOWN,
      },
      practice: {
        id: 'test.practice',
        name: 'test',
        suggestion: '',
        impact: PracticeImpact.high,
        url: '.',
      },
      overridenImpact: PracticeImpact.high,
      evaluation: PracticeEvaluationResult.practicing,
      isOn: true,
    },
    practiceWithContext,
  );
};
