/* eslint-disable @typescript-eslint/camelcase */
import _ from 'lodash';
import Bitbucket from 'bitbucket';

export const bitbucketRepoCommitsResponseFactory = (params?: Partial<Bitbucket.Schema.Commit>): Bitbucket.Schema.Commit => {
  return _.merge(
    {
      rendered: {
        message: {
          raw:
            'This checkin might win the prize for the highest amount of XXXs/lines of code:\nit needs a deep review, please :)\n\nFix W_ExtensionFunction_call_varargs to use the updated calling convention,\nand implement ctx_Arg_Parse.',
          markup: 'markdown',
          html:
            '<p>This checkin might win the prize for the highest amount of XXXs/lines of code:<br />\nit needs a deep review, please :)</p>\n<p>Fix W_ExtensionFunction_call_varargs to use the updated calling convention,<br />\nand implement ctx_Arg_Parse.</p>',
          type: 'rendered',
        },
      },
      hash: 'f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
      repository: {
        links: {
          self: {
            href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy',
          },
          html: {
            href: 'https://bitbucket.org/pypy/pypy',
          },
          avatar: {
            href: 'https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930',
          },
        },
        type: 'repository',
        name: 'pypy',
        full_name: 'pypy/pypy',
        uuid: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
      },
      links: {
        self: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        comments: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df/comments',
        },
        patch: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/patch/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        html: {
          href: 'https://bitbucket.org/pypy/pypy/commits/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        diff: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df',
        },
        approve: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df/approve',
        },
        statuses: {
          href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/f9c2cfcfaafa644dcc286ce2fc8b3386d46c11df/statuses',
        },
      },
      author: {
        raw: 'Antonio Cuni <anto.cuni@gmail.com>',
        type: 'author',
        user: {
          display_name: 'Antonio Cuni',
          uuid: '{2ba51dad-da92-44d7-96b9-9d7b6eb196cb}',
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/users/%7B2ba51dad-da92-44d7-96b9-9d7b6eb196cb%7D',
            },
            html: {
              href: 'https://bitbucket.org/%7B2ba51dad-da92-44d7-96b9-9d7b6eb196cb%7D/',
            },
            avatar: {
              href:
                'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:136fd9cc-4f8c-4548-8dbc-dd50a6d749d9/8cc41205-88c2-4279-b475-27189150a116/128',
            },
          },
          nickname: 'antocuni',
          type: 'user',
          account_id: '557058:136fd9cc-4f8c-4548-8dbc-dd50a6d749d9',
        },
      },
      summary: {
        raw:
          'This checkin might win the prize for the highest amount of XXXs/lines of code:\nit needs a deep review, please :)\n\nFix W_ExtensionFunction_call_varargs to use the updated calling convention,\nand implement ctx_Arg_Parse.',
        markup: 'markdown',
        html:
          '<p>This checkin might win the prize for the highest amount of XXXs/lines of code:<br />\nit needs a deep review, please :)</p>\n<p>Fix W_ExtensionFunction_call_varargs to use the updated calling convention,<br />\nand implement ctx_Arg_Parse.</p>',
      },
      parents: [
        {
          hash: '5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
          type: 'commit',
          links: {
            self: {
              href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
            },
            html: {
              href: 'https://bitbucket.org/pypy/pypy/commits/5c9a3fd99fc743f49aaad30952397ab34ad4f40b',
            },
          },
        },
      ],
      date: '2019-11-19T10:48:09+00:00',
      message:
        'This checkin might win the prize for the highest amount of XXXs/lines of code:\nit needs a deep review, please :)\n\nFix W_ExtensionFunction_call_varargs to use the updated calling convention,\nand implement ctx_Arg_Parse.',
      type: 'commit',
    },
    params,
  );
};
