import { Paginated } from '../../../../inspectors/common/Paginated';

import { PullCommits } from '../../model';
export const getRepoCommits: Paginated<PullCommits> = {
  items: [
    {
      sha: 'f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
      commit: {
        url: 'https://bitbucket.org/pypy/pypy/commits/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        message:
          'This checkin might win the prize for the highest amount of XXXs/lines of code:\n' +
          'it needs a deep review, please :)\n' +
          '\n' +
          'Fix W_ExtensionFunction_call_varargs to use the updated calling convention,\n' +
          'and implement ctx_Arg_Parse.',
        author: {
          name: 'antocuni',
          email: 'undefined',
          date: '2019-11-19T10:48:09+00:00',
        },
        tree: {
          sha: '5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
          url: 'https://bitbucket.org/pypy/pypy/commits/5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
        },

        verified: false,
      },
    },
  ],
  totalCount: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  page: 1,
  perPage: 1,
};
