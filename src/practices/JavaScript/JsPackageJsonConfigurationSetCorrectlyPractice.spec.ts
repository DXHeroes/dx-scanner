import { MetadataType } from '../../services/model';
import { JsPackageJsonConfigurationSetCorrectlyPractice } from './JsPackageJsonConfigurationSetCorrectlyPractice';
import { PracticeEvaluationResult } from '../../model';
import { TestContainerContext, createTestContainer } from '../../inversify.config';

describe('JsPackageJsonConfigurationSetCorrectlyPractice', () => {
  let practice: JsPackageJsonConfigurationSetCorrectlyPractice;
  let containerCtx: TestContainerContext;

  beforeAll(() => {
    containerCtx = createTestContainer();
    containerCtx.container.bind('JsPackageJsonConfigurationSetCorrectlyPractice').to(JsPackageJsonConfigurationSetCorrectlyPractice);
    practice = containerCtx.container.get('JsPackageJsonConfigurationSetCorrectlyPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('Returns practicing if scripts build, start, test, lint are used', async () => {
    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });

  it('Returns notPracticing if tscripts build, start, test, lint are NOT used', async () => {
    containerCtx.virtualFileSystemService.setFileSystem({
      type: MetadataType.dir,
      children: {
        'package.json': {
          type: MetadataType.file,
          data: `{ "scripts": {
              "no": "script"
            }
        }`,
        },
      },
    });

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('Returns unknown if there are no file inspector', async () => {
    const evaluated = await practice.evaluate({ ...containerCtx.practiceContext, fileInspector: undefined });
    expect(evaluated).toEqual(PracticeEvaluationResult.unknown);
  });
});
