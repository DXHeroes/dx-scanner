export const listPullRequestsParamas = `
query ($owner: String!, $repo: String!, $count: Int!, $states: [PullRequestState!],  $startCursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequests(last: $count, states: $states, before: $startCursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
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
          body
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
