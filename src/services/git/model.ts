export enum GitService {
  github = 'github.com',
}

export interface UserInfo {
  login: string;
  id: number | string;
  url: string;
}

export interface PullRequest {
  user: UserInfo;
  id: number;
  url: string;
  body: string;
  createdAt: string;
  updatedAt: string | null;
  closedAt: string | null;
  mergedAt: string | null;
  state: string;
  base?: { repo: Repo };
}

export interface PullRequestReview {
  user: UserInfo;
  id: number;
  body: string;
  state: string;
  url: string;
}

export interface Commit {
  sha?: string;
  url: string;
  author: Author;
  message: string;
  tree: Tree;
  verified: boolean;
}

export interface ContributorStats {
  author: UserInfo;
  total: number;
  weeks: Weeks[];
}

interface Weeks {
  startOfTheWeek: number;
  additions: number;
  deletions: number;
  commits: number;
}

export interface Contributor {
  user: UserInfo;
  followersUrl: string | undefined;
  contributions: number | undefined;
}

export interface RepoContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'dir' | 'file' | 'symlink';
}

export interface File extends RepoContent {
  type: 'file';
  content: string;
  encoding: BufferEncoding;
}

export interface Symlink extends RepoContent {
  type: 'symlink';
  target: string;
}

export type Directory = Array<RepoContent>;

export interface Issue {
  user: UserInfo;
  id: number | string;
  url: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  state: string;
  pullRequestUrl?: string;
}

export interface IssueComment {
  user: UserInfo;
  id: number;
  url: string;
  body: string;
  createdAt: string;
  updatedAt: string | undefined;
  authorAssociation: string;
}

export interface PullFiles {
  sha: string;
  fileName: string;
  status: string;
  deletions: number;
  changes: number;
  contentsUrl: string;
}

export interface PullCommits {
  sha: string;
  commit: Commit;
}

interface Author {
  name: string;
  email: string;
  date: string;
}

interface Tree {
  sha: string;
  url: string;
}

interface Repo {
  url: string;
  id: number | string;
  name: string;
  owner: UserInfo;
}
