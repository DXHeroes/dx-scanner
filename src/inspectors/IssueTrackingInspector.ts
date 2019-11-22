/* eslint-disable @typescript-eslint/camelcase */
import { injectable, inject } from 'inversify';
import { IIssueTrackingInspector } from './IIssueTrackingInspector';
import { Paginated } from './common/Paginated';
import { Issue, IssueComment } from '../services/git/model';
import { Types } from '../types';
import { CSVService } from '../model';

@injectable()
export class IssueTrackingInspector implements IIssueTrackingInspector {
  private service: CSVService;

  constructor(@inject(Types.IContentRepositoryBrowser) service: CSVService) {
    this.service = service;
  }

  async getIssues(owner: string, repo: string): Promise<Paginated<Issue>> {
    return this.service.getIssues(owner, repo);
  }

  async getIssue(owner: string, repo: string, issueId: number): Promise<Issue> {
    return this.service.getIssue(owner, repo, issueId);
  }

  async listIssueComments(owner: string, repo: string, issueId: number): Promise<Paginated<IssueComment>> {
    return this.service.getIssueComments(owner, repo, issueId);
  }
}
