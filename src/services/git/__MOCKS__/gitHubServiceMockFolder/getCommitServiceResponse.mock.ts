import { Commit } from '../../model';

export const getCommitServiceResponse: Commit = {
  sha: '762941318ee16e59dabbacb1b4049eec22f0d303',
  url: 'https://api.github.com/repos/octocat/Hello-World/git/commits/762941318ee16e59dabbacb1b4049eec22f0d303',
  author: { name: 'Johnneylee Jack Rollins', email: 'Johnneylee.rollins@gmail.com', date: '2011-09-14T04:42:41Z' },
  tree: {
    sha: 'b4eecafa9be2f2006ce1b709d6857b07069b4608',
    url: 'https://api.github.com/repos/octocat/Hello-World/git/trees/b4eecafa9be2f2006ce1b709d6857b07069b4608',
  },
  message: 'New line at end of file. --Signed off by Spaceghost',
  verified: false,
};
