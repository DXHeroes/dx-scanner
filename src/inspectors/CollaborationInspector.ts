import { inject, injectable } from 'inversify';
import { Types } from '../types';
import { ListGetterOptions } from './common/ListGetterOptions';
import { ICollaborationInspector, PullRequestState } from './ICollaborationInspector';
import { VCSService } from '../model';

@injectable()
export class CollaborationInspector implements ICollaborationInspector {
  private service: VCSService;

  constructor(@inject(Types.IContentRepositoryBrowser) service: VCSService) {
    this.service = service;
  }

  async getPullRequests(owner: string, repo: string, options?: ListGetterOptions<{ state?: PullRequestState }>) {
    return this.service.getPullRequests(owner, repo, options);
  }

  async getPullRequest(owner: string, repo: string, prNumber: number) {
    return this.service.getPullRequest(owner, repo, prNumber);
  }

  async getPullRequestFiles(owner: string, repo: string, prNumber: number) {
    return this.service.getPullRequestFiles(owner, repo, prNumber);
  }

  async getPullCommits(owner: string, repo: string, prNumber: number) {
    return this.service.getPullCommits(owner, repo, prNumber);
  }
}
