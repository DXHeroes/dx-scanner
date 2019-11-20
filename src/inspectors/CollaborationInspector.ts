import { injectable, inject } from 'inversify';
import { ProjectIssueBrowserService as ContentRepositoryBrowserService } from '../model';
import { Types } from '../types';
import { ICollaborationInspector } from './ICollaborationInspector';

@injectable()
export class CollaborationInspector implements ICollaborationInspector {
  private service: ContentRepositoryBrowserService;

  constructor(@inject(Types.IContentRepositoryBrowser) service: ContentRepositoryBrowserService) {
    this.service = service;
  }

  async getPullRequests(owner: string, repo: string) {
    return this.service.getPullRequests(owner, repo);
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

  async getRepoCommits(owner: string, repo: string, sha?: string) {
    return this.service.getRepoCommits(owner, repo, sha);
  }
}
