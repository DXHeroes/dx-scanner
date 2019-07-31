/* eslint-disable @typescript-eslint/camelcase */
import { injectable, inject } from 'inversify';
import { IIssueTrackingInspector } from './IIssueTrackingInspector';
import { Paginated } from './common/Paginated';
import { Issue, IssueComment } from '../services/git/model';
import { Types } from '../types';
import { ProjectIssueBrowserService } from './model';

@injectable()
export class IssueTrackingInspector implements IIssueTrackingInspector {
  private service: ProjectIssueBrowserService;

  constructor(@inject(Types.IContentRepositoryBrowser) service: ProjectIssueBrowserService) {
    this.service = service;
  }

  async getIssues(owner: string, repo: string): Promise<Paginated<Issue>> {
    return this.service.getIssues(owner, repo);
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    return this.service.getIssue(owner, repo, issueNumber);
  }

  async listIssueComments(owner: string, repo: string, id: number): Promise<Paginated<IssueComment>> {
    return this.service.getIssueComments(owner, repo, id);
  }
}
