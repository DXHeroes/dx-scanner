import { Container } from 'inversify';
import { Types, ProjectComponentContextFactory, PracticeContextFactory } from '../../types';
import { ProjectComponentContext } from './ProjectComponentContext';
import { ProjectComponent } from '../../model';
import { PracticeContext } from '../practice/PracticeContext';
import { IGitInspector } from '../../inspectors/IGitInspector';

export const bindProjectComponentContext = (container: Container) => {
  container.bind(Types.ProjectComponentContextFactory).toFactory(
    (ctx): ProjectComponentContextFactory => {
      return (projectComponent: ProjectComponent) => {
        const projectComponentContextContainer = createProjectComponentContainer(projectComponent, ctx.container as Container);
        return projectComponentContextContainer.get(ProjectComponentContext);
      };
    },
  );
};

const createProjectComponentContainer = (projectComponent: ProjectComponent, rootContainer: Container): Container => {
  const container = rootContainer.createChild();
  container.bind(Types.ProjectComponent).toConstantValue(projectComponent);
  container.bind(Types.PracticeContextFactory).toFactory(
    (ctx): PracticeContextFactory => {
      return (projectComponent: ProjectComponent): PracticeContext => {
        let gitInspector: IGitInspector | undefined;
        try {
          gitInspector = ctx.container.get(Types.IGitInspector);
        } catch {}

        return {
          projectComponent: projectComponent,
          packageInspector: ctx.container.get(Types.IPackageInspector),
          gitInspector,
          issueTrackingInspector: undefined,
          collaborationInspector: undefined,
          fileInspector: ctx.container.get(Types.IFileInspector),
        };
      };
    },
  );
  container.bind(ProjectComponentContext).toSelf();
  return container;
};
