import { UserItem } from '../../../../../test/helpers/gitHubNock';

/* eslint-disable @typescript-eslint/camelcase */
export const getRepoCommitsResponse = [
  {
    sha: '7fd1a60b01f91b314f59955a4e4d4e80d8edf11d',
    node_id: 'MDY6Q29tbWl0MTI5NjI2OTo3ZmQxYTYwYjAxZjkxYjMxNGY1OTk1NWE0ZTRkNGU4MGQ4ZWRmMTFk',
    commit: {
      author: {
        name: 'The Octocat',
        email: 'octocat@nowhere.com',
        date: '2011-01-14T04:42:41Z',
      },
      committer: {
        name: 'The Octocat',
        email: 'octocat@nowhere.com',
        date: '2011-01-14T04:42:41Z',
      },
      message: 'Merge pull request #6 from Spaceghost/patch-1\n\nNew line at end of file.',
      tree: {
        sha: 'b4eecafa9be2f2006ce1b709d6857b07069b4608',
        url: 'https://api.github.com/repos/octocat/Hello-World/git/trees/b4eecafa9be2f2006ce1b709d6857b07069b4608',
      },
      url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d',
      comment_count: 53,
      verification: {
        verified: false,
        reason: 'unsigned',
        signature: null,
        payload: null,
      },
    },
    url: 'https://api.github.com/repos/octocat/Hello-World/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d',
    html_url: 'https://github.com/octocat/Hello-World/commit/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d',
    comments_url: 'https://api.github.com/repos/octocat/Hello-World/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d/comments',
    author: new UserItem('583231', 'octocat'),
    committer: new UserItem('583231', 'octocat'),
    parents: [
      {
        sha: '553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
        url: 'https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
        html_url: 'https://github.com/octocat/Hello-World/commit/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
      },
      {
        sha: '762941318ee16e59dabbacb1b4049eec22f0d303',
        url: 'https://api.github.com/repos/octocat/Hello-World/commits/762941318ee16e59dabbacb1b4049eec22f0d303',
        html_url: 'https://github.com/octocat/Hello-World/commit/762941318ee16e59dabbacb1b4049eec22f0d303',
      },
    ],
  },
  {
    sha: '762941318ee16e59dabbacb1b4049eec22f0d303',
    node_id: 'MDY6Q29tbWl0MTI5NjI2OTo3NjI5NDEzMThlZTE2ZTU5ZGFiYmFjYjFiNDA0OWVlYzIyZjBkMzAz',
    commit: {
      author: {
        name: 'Johnneylee Jack Rollins',
        email: 'johnneylee.rollins@gmail.com',
        date: '2011-01-14T04:42:41Z',
      },
      committer: {
        name: 'Johnneylee Jack Rollins',
        email: 'johnneylee.rollins@gmail.com',
        date: '2011-01-14T04:42:41Z',
      },
      message: 'New line at end of file. --Signed off by Spaceghost',
      tree: {
        sha: 'b4eecafa9be2f2006ce1b709d6857b07069b4608',
        url: 'https://api.github.com/repos/octocat/Hello-World/git/trees/b4eecafa9be2f2006ce1b709d6857b07069b4608',
      },
      url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/762941318ee16e59dabbacb1b4049eec22f0d303',
      comment_count: 145,
      verification: {
        verified: false,
        reason: 'unsigned',
        signature: null,
        payload: null,
      },
    },
    url: 'https://api.github.com/repos/octocat/Hello-World/commits/762941318ee16e59dabbacb1b4049eec22f0d303',
    html_url: 'https://github.com/octocat/Hello-World/commit/762941318ee16e59dabbacb1b4049eec22f0d303',
    comments_url: 'https://api.github.com/repos/octocat/Hello-World/commits/762941318ee16e59dabbacb1b4049eec22f0d303/comments',
    author: new UserItem('251370', 'Spaceghost'),
    committer: new UserItem('251370', 'Spaceghost'),
    parents: [
      {
        sha: '553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
        url: 'https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
        html_url: 'https://github.com/octocat/Hello-World/commit/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
      },
    ],
  },
  {
    sha: '553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
    node_id: 'MDY6Q29tbWl0MTI5NjI2OTo1NTNjMjA3N2YwZWRjM2Q1ZGM1ZDE3MjYyZjZhYTQ5OGU2OWQ2Zjhl',
    commit: {
      author: {
        name: 'cameronmcefee',
        email: 'cameron@github.com',
        date: '2011-01-14T04:42:41Z',
      },
      committer: {
        name: 'cameronmcefee',
        email: 'cameron@github.com',
        date: '2011-01-26T19:06:08Z',
      },
      message: 'first commit',
      tree: {
        sha: 'fcf4a9bba6857422971d67147517eb5edfdbf48d',
        url: 'https://api.github.com/repos/octocat/Hello-World/git/trees/fcf4a9bba6857422971d67147517eb5edfdbf48d',
      },
      url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
      comment_count: 57,
      verification: {
        verified: false,
        reason: 'unsigned',
        signature: null,
        payload: null,
      },
    },
    url: 'https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
    html_url: 'https://github.com/octocat/Hello-World/commit/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e',
    comments_url: 'https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e/comments',
    author: null,
    committer: null,
    parents: [],
  },
];
