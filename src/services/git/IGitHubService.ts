export enum GitHubPullRequestState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}

export enum GitHubGqlPullRequestState {
  open = 'is:open',
  closed = 'is:closed is:unmerged', //is:closed = CLOSED AND MERGED, is:unmerged = CLOSED and OPEN
  all = '',
}

export enum GitHubIssueState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}
