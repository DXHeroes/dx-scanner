import { GitHubGqlPullRequestState } from '..';

export const generateSearchQuery = (owner: string, repo: string, from: Date, state: GitHubGqlPullRequestState) =>
  `"repo:${owner + '/' + repo} is:pr ${state} created:>${from.toISOString().slice(0, 10)}"`;
export const listPullRequestsQuery = (searchQuery: string) => {
  return `
  query ($count: Int!, $startCursor: String) {
  search(last: $count, after: $startCursor, query: ${searchQuery}, type:ISSUE) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        ... on PullRequest {
          author {
            login
            url
            ... on User {
              id
            }
          }
          url
          number
          title
          mergeCommit {
            id
          }
          createdAt
          updatedAt
          closedAt
          mergedAt
          state
          baseRepository {
            url
            name
            id
            owner {
              url
              id
              login
            }
          }
          additions
          deletions
        }
      }
    }
  }
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
}
`;
};
