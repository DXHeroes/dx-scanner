export enum GitHubPullRequestState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}

export enum GitHubGqlPullRequestState {
  open = 'is:open',
  closed = 'is:closed', //is:closed = CLOSED AND MERGED
  all = '',
}

export enum GitHubIssueState {
  open = 'open',
  closed = 'closed',
  all = 'all',
}
