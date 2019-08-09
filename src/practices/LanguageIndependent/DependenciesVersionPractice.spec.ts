import { PracticeEvaluationResult } from '../../model';
import { DependenciesVersionPractice } from './DependenciesVersionPractice';
import { createTestContainer, TestContainerContext } from '../../inversify.config';
import { VirtualDirectory } from '../../services/IVirtualFileSystemService';
import { IPackageInspector } from '../../inspectors/IPackageInspector';

describe('DependenciesVersionPractice', () => {
  let practice: DependenciesVersionPractice;
  let containerCtx: TestContainerContext;
  let packageInspector: IPackageInspector;

  beforeAll(async () => {
    containerCtx = createTestContainer();
    packageInspector = <IPackageInspector>containerCtx.practiceContext.packageInspector;
    containerCtx.container.bind('DependenciesVersionPractice').to(DependenciesVersionPractice);
    practice = containerCtx.container.get('DependenciesVersionPractice');
  });

  afterEach(async () => {
    containerCtx.virtualFileSystemService.clearFileSystem();
  });

  it('not practicing if newer package versions exists', async () => {
    const virtualDirectory: VirtualDirectory = {
      'package.json': JSON.stringify({
        dependencies: {
          'ts-node': '^1',
          typescript: '^1',
        },
      }),
    };

    /**
     * Reload package inspector with new file system
     */
    containerCtx.virtualFileSystemService.setFileSystem(virtualDirectory);
    await packageInspector.init();

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.notPracticing);
  });

  it('practicing if newest package version dependency', async () => {
    const virtualDirectory: VirtualDirectory = {
      'package.json': JSON.stringify({
        dependencies: {
          typescript: '^1000',
        },
      }),
    };

    /**
     * Reload package inspector with new file system
     */
    containerCtx.virtualFileSystemService.setFileSystem(virtualDirectory);
    await packageInspector.init();

    const evaluated = await practice.evaluate(containerCtx.practiceContext);
    expect(evaluated).toEqual(PracticeEvaluationResult.practicing);
  });
});
