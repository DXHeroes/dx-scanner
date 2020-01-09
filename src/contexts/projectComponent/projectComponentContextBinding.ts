import { Container } from 'inversify';
import { IGitInspector } from '../../inspectors/IGitInspector';
import { ProjectComponent } from '../../model';
import { PracticeContextFactory, ProjectComponentContextFactory, Types } from '../../types';
import { ConfigProvider } from '../../scanner/ConfigProvider';
import { PracticeContext } from '../practice/PracticeContext';
import { ProjectComponentContext } from './ProjectComponentContext';

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
  container.bind(Types.ConfigProvider).to(ConfigProvider);
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
          issueTrackingInspector: ctx.container.get(Types.IIssueTrackingInspector),
          collaborationInspector: ctx.container.get(Types.ICollaborationInspector),
          fileInspector: ctx.container.get(Types.IFileInspector),
          root: {
            fileInspector: ctx.container.get(Types.IRootFileInspector),
          },
        };
      };
    },
  );

  container.bind(ProjectComponentContext).toSelf();
  return container;
};
