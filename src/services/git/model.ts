export enum GitService {
  github = 'github.com',
  bitbucket = 'bitbucket.org',
  gitlab = 'gitlab.com', //when user does not host gitlab on his own
}

export interface UserInfo {
  login: string;
  id: string;
  url: string;
}

export interface PullRequest {
  user: UserInfo;
  title: string;
  id: number;
  url: string;
  body: string;
  sha: string;
  createdAt: string;
  updatedAt: string | null;
  closedAt: string | null;
  mergedAt: string | null;
  state: string;
  base: { repo: Repo };
  lines?: Lines;
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
  contributions: number;
}

export interface RepoContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: RepoContentType;
}

export enum RepoContentType {
  dir = 'dir',
  file = 'file',
  symlink = 'symlink',
}

export interface File extends RepoContent {
  type: RepoContentType.file;
  content: string | undefined;
  encoding: BufferEncoding | undefined;
}

export interface Symlink extends RepoContent {
  type: RepoContentType.symlink;
  target: string;
}

export type Directory = Array<RepoContent>;

export interface Issue {
  user: UserInfo;
  id: number;
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
  body: string | undefined;
  createdAt: string;
  updatedAt: string | undefined;
  authorAssociation: string | undefined;
}

export interface Branch {
  name: string;
  type: string;
}

export type PullRequestComment = CreatedUpdatedPullRequestComment & {
  authorAssociation: string | undefined;
};

export type CreatedUpdatedPullRequestComment = {
  user: UserInfo;
  id: number;
  url: string;
  body: string | undefined;
  createdAt: string;
  updatedAt: string | undefined;
};

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

export interface Lines {
  additions: number;
  deletions: number;
  changes: number;
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
  id: string;
  name: string;
  owner: UserInfo;
}
