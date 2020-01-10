/* eslint-disable @typescript-eslint/camelcase */
import { injectable, inject } from 'inversify';
import { IIssueTrackingInspector, IssueState } from './IIssueTrackingInspector';
import { Paginated } from './common/Paginated';
import { Issue, IssueComment } from '../services/git/model';
import { Types } from '../types';
import { VCSService } from '../model';
import { ListGetterOptions } from '.';

@injectable()
export class IssueTrackingInspector implements IIssueTrackingInspector {
  private service: VCSService;

  constructor(@inject(Types.IContentRepositoryBrowser) service: VCSService) {
    this.service = service;
  }

  async getIssues(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: IssueState }>,
  ): Promise<Paginated<Issue>> {
    return this.service.getIssues(owner, repo, options);
  }

  async getIssue(owner: string, repo: string, issueId: number): Promise<Issue> {
    return this.service.getIssue(owner, repo, issueId);
  }

  async listIssueComments(owner: string, repo: string, issueId: number): Promise<Paginated<IssueComment>> {
    return this.service.getIssueComments(owner, repo, issueId);
  }
}
