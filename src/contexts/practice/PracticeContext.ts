import { ICollaborationInspector } from '../../inspectors/ICollaborationInspector';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { IGitInspector } from '../../inspectors/IGitInspector';
import { IIssueTrackingInspector } from '../../inspectors/IIssueTrackingInspector';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { PracticeImpact, ProjectComponent } from '../../model';
import { PracticeConfig } from '../IConfigProvider';

export interface PracticeContext {
  /**
   * Current component(app)
   */
  projectComponent: ProjectComponent;

  /**
   * Works with package managers. You can read all installed project's dependencies.
   */
  packageInspector: IPackageInspector | undefined;

  /**
   * Lists commits, authors, tags
   */
  gitInspector: IGitInspector | undefined;

  /**
   * Works with issues/tasks in a project management tool
   */
  issueTrackingInspector: IIssueTrackingInspector | undefined;

  /**
   * Pull Requests, Commits in a Pull Request
   */
  collaborationInspector: ICollaborationInspector | undefined;

  /**
   * Lists files relatively to the base path of component
   */
  fileInspector: IFileInspector | undefined;

  /**
   * Configured settings for a practice
   */
  config?: PracticeConfig | PracticeImpact;

  /**
   * Inspectors mapped to from the root of repository
   */
  root: {
    fileInspector: IFileInspector | undefined;
  };
}
