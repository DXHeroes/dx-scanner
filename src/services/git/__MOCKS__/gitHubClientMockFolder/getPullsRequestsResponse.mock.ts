/* eslint-disable @typescript-eslint/camelcase */
import Octokit from '@octokit/rest';
import { UserItem, Repository, BranchItem } from '../../../../../test/helpers/gitHubNock';

export const getPullsRequestsResponse: Octokit.ReposListPullRequestsAssociatedWithCommitResponse = [
  {
    url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347',
    id: 1,
    node_id: 'MDExOlB1bGxSZXF1ZXN0MQ==',
    html_url: 'https://github.com/octocat/Hello-World/pull/1347',
    diff_url: 'https://github.com/octocat/Hello-World/pull/1347.diff',
    patch_url: 'https://github.com/octocat/Hello-World/pull/1347.patch',
    issue_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1347',
    commits_url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits',
    review_comments_url: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347/comments',
    review_comment_url: 'https://api.github.com/repos/octocat/Hello-World/pulls/comments{/number}',
    comments_url: 'https://api.github.com/repos/octocat/Hello-World/issues/1347/comments',
    statuses_url: 'https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e',
    number: 1347,
    state: 'open',
    locked: true,
    title: 'new-feature',
    user: new UserItem(1, 'octocat'),
    body: 'Please pull these awesome changes',
    labels: [
      {
        id: 208045946,
        node_id: 'MDU6TGFiZWwyMDgwNDU5NDY=',
        url: 'https://api.github.com/repos/octocat/Hello-World/labels/bug',
        name: 'bug',
        description: "Something isn't working",
        color: 'f29513',
        default: true,
      },
    ],
    milestone: {
      url: 'https://api.github.com/repos/octocat/Hello-World/milestones/1',
      html_url: 'https://github.com/octocat/Hello-World/milestones/v1.0',
      labels_url: 'https://api.github.com/repos/octocat/Hello-World/milestones/1/labels',
      id: 1002604,
      node_id: 'MDk6TWlsZXN0b25lMTAwMjYwNA==',
      number: 1,
      state: 'open',
      title: 'v1.0',
      description: 'Tracking milestone for version 1.0',
      creator: new UserItem(1, 'octocat'),
      open_issues: 4,
      closed_issues: 8,
      created_at: '2011-04-10T20:09:31Z',
      updated_at: '2014-03-03T18:58:10Z',
      closed_at: '2013-02-12T13:22:01Z',
      due_on: '2012-10-09T23:39:01Z',
    },
    active_lock_reason: 'too heated',
    created_at: '2011-01-26T19:01:12Z',
    updated_at: '2011-01-26T19:01:12Z',
    closed_at: '2011-01-26T19:01:12Z',
    merged_at: '2011-01-26T19:01:12Z',
    merge_commit_sha: 'e5bd3914e2e596debea16f433f57875b5b90bcd6',
    assignee: new UserItem(1, 'octocat'),
    assignees: [new UserItem(1, 'octocat'), new UserItem(1, 'hubot')],
    requested_reviewers: [new UserItem(1, 'other_user')],
    requested_teams: [
      {
        id: 1,
        node_id: 'MDQ6VGVhbTE=',
        url: 'https://api.github.com/teams/1',
        name: 'Justice League',
        slug: 'justice-league',
        description: 'A great team.',
        privacy: 'closed',
        permission: 'admin',
        members_url: 'https://api.github.com/teams/1/members{/member}',
        repositories_url: 'https://api.github.com/teams/1/repos',
        parent: null,
      },
    ],
    head: new BranchItem('new-topic', new Repository(1296269, 'Hello-World', new UserItem(1, 'octocat'))),
    base: new BranchItem('master', new Repository(1296269, 'Hello-World', new UserItem(1, 'octocat'))),
    _links: {
      self: {
        href: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347',
      },
      html: {
        href: 'https://github.com/octocat/Hello-World/pull/1347',
      },
      issue: {
        href: 'https://api.github.com/repos/octocat/Hello-World/issues/1347',
      },
      comments: {
        href: 'https://api.github.com/repos/octocat/Hello-World/issues/1347/comments',
      },
      review_comments: {
        href: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347/comments',
      },
      review_comment: {
        href: 'https://api.github.com/repos/octocat/Hello-World/pulls/comments{/number}',
      },
      commits: {
        href: 'https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits',
      },
      statuses: {
        href: 'https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e',
      },
    },
    author_association: 'OWNER',
    draft: false,
  },
];
