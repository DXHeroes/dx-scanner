import { IPackageInspector } from '../../inspectors/IPackageInspector';
import { IGitInspector } from '../../inspectors/IGitInspector';
import { IIssueTrackingInspector } from '../../inspectors/IIssueTrackingInspector';
import { ProjectComponent } from '../../model';
import { IFileInspector } from '../../inspectors/IFileInspector';
import { ICollaborationInspector } from '../../inspectors/ICollaborationInspector';

export interface PracticeContext {
  projectComponent: ProjectComponent;
  packageInspector: IPackageInspector | undefined;
  gitInspector: IGitInspector | undefined;
  issueTrackingInspector: IIssueTrackingInspector | undefined;
  collaborationInspector: ICollaborationInspector | undefined;
  fileInspector: IFileInspector | undefined;
}
