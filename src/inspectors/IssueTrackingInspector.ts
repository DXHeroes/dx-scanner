import { inject, injectable } from 'inversify';
import { ListGetterOptions } from '.';
import { VCSService } from '../model';
import { ICache, InMemoryCache } from '../scanner/cache';
import { Issue, IssueComment } from '../services/git/model';
import { Types } from '../types';
import { Paginated } from './common/Paginated';
import { IIssueTrackingInspector, IssueState } from './IIssueTrackingInspector';

@injectable()
export class IssueTrackingInspector implements IIssueTrackingInspector {
  private service: VCSService;
  private cache: ICache;

  constructor(@inject(Types.IContentRepositoryBrowser) service: VCSService) {
    this.service = service;
    this.cache = new InMemoryCache();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  purgeCache() {
    this.cache.purge();
  }

  async listIssues(
    owner: string,
    repo: string,
    options?: { withDiffStat?: boolean } & ListGetterOptions<{ state?: IssueState }>,
  ): Promise<Paginated<Issue>> {
    return this.cache.getOrSet(`IssueTrackingInspector:listIssues:${owner}:${repo}:${JSON.stringify(options)}`, async () => {
      return this.service.listIssues(owner, repo, options);
    });
  }

  async getIssue(owner: string, repo: string, issueId: number): Promise<Issue> {
    return this.cache.getOrSet(`IssueTrackingInspector:getIssue:${owner}:${repo}:${issueId}`, async () => {
      return this.service.getIssue(owner, repo, issueId);
    });
  }

  //TODO add options
  async listIssueComments(owner: string, repo: string, issueId: number): Promise<Paginated<IssueComment>> {
    return this.cache.getOrSet(`IssueTrackingInspector:listIssueComments:${owner}:${repo}:${issueId}`, async () => {
      return this.service.listIssueComments(owner, repo, issueId);
    });
  }
}
