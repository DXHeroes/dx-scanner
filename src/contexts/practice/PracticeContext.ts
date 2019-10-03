import { ICollaborationInspector } from '../../inspectors/ICollaborationInspector';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { IGitInspector } from '../../inspectors/IGitInspector';
import { IIssueTrackingInspector } from '../../inspectors/IIssueTrackingInspector';
import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { PracticeImpact, ProjectComponent } from '../../model';
import { PracticeConfig } from '../IConfigProvider';

export interface PracticeContext {
  projectComponent: ProjectComponent;
  packageInspector: IPackageInspector | undefined;
  gitInspector: IGitInspector | undefined;
  issueTrackingInspector: IIssueTrackingInspector | undefined;
  collaborationInspector: ICollaborationInspector | undefined;
  fileInspector: IFileInspector | undefined;
  config?: PracticeConfig | PracticeImpact;
}
