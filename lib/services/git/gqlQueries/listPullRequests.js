"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPullRequestsQuery = exports.generateSearchQuery = void 0;
exports.generateSearchQuery = (owner, repo, from, state) => `"repo:${owner + '/' + repo} is:pr ${state} created:>${from.toISOString().slice(0, 10)}"`;
exports.listPullRequestsQuery = (searchQuery) => {
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
//# sourceMappingURL=listPullRequests.js.map