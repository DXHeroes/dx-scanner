export const getPullCommitsServiceResponse = {
  hasNextPage: false,
  hasPreviousPage: false,
  items: [
    {
      commit: {
        author: { date: '2011-05-09T19:09:20Z', email: 'myemailismels@yahoo.com', name: 'unoju' },
        message: 'Edited README via GitHub',
        tree: {
          sha: 'f1b625880dea0b3af9168f3537838d2607217460',
          url: 'https://api.github.com/repos/octocat/Hello-World/git/trees/f1b625880dea0b3af9168f3537838d2607217460',
        },
        url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/7044a8a032e85b6ab611033b2ac8af7ce85805b2',
        verified: false,
      },
      sha: '7044a8a032e85b6ab611033b2ac8af7ce85805b2',
    },
  ],
  page: 1,
  perPage: 1,
  totalCount: 1,
};
