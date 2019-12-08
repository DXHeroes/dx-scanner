import { Paginated } from './common/Paginated';
import { Issue, IssueComment } from '../services/git/model';

export enum IssueState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}

export enum BitbucketIssueState {
  new = 'new',
  closed = 'closed',
  duplicate = 'duplicate',
  resolved = 'resolved',
  invalid = 'invalid',
}

export interface IIssueTrackingInspector {
  getIssues(owner: string, repo: string): Promise<Paginated<Issue>>;
  getIssue(owner: string, repo: string, id: number): Promise<Issue>;
  listIssueComments(owner: string, repo: string, id: number): Promise<Paginated<IssueComment>>;
}
