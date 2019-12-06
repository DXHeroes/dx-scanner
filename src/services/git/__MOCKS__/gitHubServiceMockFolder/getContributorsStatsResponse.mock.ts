import { UserItem } from '../../../../test/helpers/gitHubNock';

/* eslint-disable @typescript-eslint/camelcase */
export const getContributorsStatsResponse = [
  {
    total: 1,
    weeks: [
      {
        w: 1315699200,
        a: 1,
        d: 1,
        c: 1,
      },
      {
        w: 1316304000,
        a: 0,
        d: 0,
        c: 0,
      },
      {
        w: 1316908800,
        a: 0,
        d: 0,
        c: 0,
      },
    ],
    author: new UserItem('251370', 'Spaceghost'),
  },
];
