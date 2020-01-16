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

  async listIssues(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: IssueState }>,
  ): Promise<Paginated<Issue>> {
    return this.service.listIssues(owner, repo, options);
  }

  async getIssue(owner: string, repo: string, issueId: number): Promise<Issue> {
    return this.service.getIssue(owner, repo, issueId);
  }

  //TODO add options
  async listIssueComments(owner: string, repo: string, issueId: number): Promise<Paginated<IssueComment>> {
    return this.service.listIssueComments(owner, repo, issueId);
  }
}
