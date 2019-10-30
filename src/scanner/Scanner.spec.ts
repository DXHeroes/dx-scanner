import { createRootContainer, createTestContainer, TestContainerContext } from '../inversify.config';
import { Container } from 'inversify';
import { Scanner } from './Scanner';
import { practiceWithContextFactory } from '../../test/factories/PracticeWithContextFactory';
import { PracticeEvaluationResult } from '../model';

describe('Scanner', () => {
  let rootContainer: Container;
  let containerCtx: TestContainerContext;

  beforeEach(() => {
    rootContainer = createRootContainer({ uri: '.' });
  });

  beforeAll(async () => {
    containerCtx = createTestContainer();
  });

  it('Can be instantiated from container', () => {
    const scanner = rootContainer.get(Scanner);
    expect(scanner).toBeDefined();
  });

  it('Report correctly', async () => {
    const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });
    const notPracticingPracticesToFail = reportArguments.filter(
      (practice) => practice.evaluation === PracticeEvaluationResult.notPracticing && practice.impact === 'high',
    );
  });

  /*
    Other tests are missing. They have to be either heavily mocked or
    we have to wait for other components to be finished to write the integration tests.
    (Scanner class is a integration point)
  */
});

const reportArguments = [
  {
    component: {
      framework: 'UNKNOWN',
      language: 'JavaScript',
      path: '/var/folders/w2/1gzmv1n51bs2z13yd5558ny80000gn/T/dx-scannerIrp1iV',
      platform: 'UNKNOWN',
      repositoryPath: 'https://github.com/DXHeroes/empty-js',
      type: 'Library',
    },
    practice: {
      id: 'LanguageIndependent.GitignoreIsPresent',
      name: 'Having a .gitignore',
      impact: 'high',
      suggestion:
        'Add gitignore which allow you to ignore files, such as editor backup files, build products or local configuration overrides that you never want to commit into a repository.',
      reportOnlyOnce: true,
      url: 'https://git-scm.com/docs/gitignore',
      defaultImpact: 'high',
      matcher: ['JsGitignoreIsPresentPractice'],
    },
    evaluation: 'practicing',
    impact: 'high',
    isOn: true,
  },
];
