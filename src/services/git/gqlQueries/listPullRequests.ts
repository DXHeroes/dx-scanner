export const listPullRequestsParamas = `
query ($owner: String!, $repo: String!, $states: [PullRequestState!]) {
  repository(owner: $owner, name: $repo) {
    pullRequests(states: $states, last: 100) {
      totalCount
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
