import { PullRequestState } from '../../inspectors/ICollaborationInspector';
import { GitHubIssueState } from './IGitHubService';
import { IssueState } from '../../inspectors';
import { BitbucketIssueState, BitbucketPullRequestState } from '../bitbucket/IBitbucketService';
import { GitHubPullRequestState } from './IGitHubService';
import qs from 'qs';
import _ from 'lodash';
import gitUrlParse from 'git-url-parse';
import parse from 'url-parse';

export class VCSServicesUtils {
  static getGithubPRState = (state: PullRequestState | undefined) => {
    switch (state) {
      case PullRequestState.open:
        return GitHubPullRequestState.open;
      case PullRequestState.closed:
        return GitHubPullRequestState.closed;
      case PullRequestState.all:
        return GitHubPullRequestState.all;
      default:
        return undefined;
    }
  };

  static getBitbucketPRState = (state: PullRequestState | undefined) => {
    switch (state) {
      case PullRequestState.open:
        return BitbucketPullRequestState.open;
      case PullRequestState.closed:
        return BitbucketPullRequestState.closed;
      case PullRequestState.all:
        return [BitbucketPullRequestState.open, BitbucketPullRequestState.closed, BitbucketPullRequestState.declined];
      default:
        return undefined;
    }
  };

  static getGithubIssueState = (state: IssueState | undefined) => {
    switch (state) {
      case IssueState.open:
        return GitHubIssueState.open;
      case IssueState.closed:
        return GitHubIssueState.closed;
      case IssueState.all:
        return GitHubIssueState.all;
      default:
        return undefined;
    }
  };

  static getBitbucketIssueState = (state: IssueState | undefined) => {
    switch (state) {
      case IssueState.open:
        return BitbucketIssueState.new;
      case IssueState.closed:
        return BitbucketIssueState.resolved;
      case IssueState.all:
        return [BitbucketIssueState.new, BitbucketIssueState.resolved, BitbucketIssueState.closed];
      default:
        return undefined;
    }
  };

  static getBitbucketStateQueryParam = (state: BitbucketIssueState | BitbucketIssueState[] | undefined) => {
    if (!state) {
      return;
    }
    // put state in quotation marks because of Bitbucket API https://developer.atlassian.com/bitbucket/api/2/reference/meta/filtering#query-issues
    let quotedState: string | string[] = `"${state}"`;
    if (_.isArray(state)) {
      quotedState = state.map((state) => {
        return `"${state}"`;
      });
    }

    // get q parameter
    return qs.stringify(
      { state: quotedState },
      {
        addQueryPrefix: false,
        encode: false,
        arrayFormat: 'repeat',
        delimiter: '+OR+',
      },
    );
  };

  static parseLinkHeader = (link: string, numberOfItems: number): ParsedGitHubLinkHeader | undefined => {
    if (!link) {
      return undefined;
    }
    let prev,
      next,
      page: number,
      perPage: number,
      query: string | undefined,
      params = {};

    const links = link.split(',');

    links.forEach((link) => {
      const iterator = linkGenerator();
      let current = iterator.next();

      while (!current.done) {
        const val = link.match(current.value.link);

        if (val) {
          const values = val['input']?.match(/\s*<?([^>]*)>(.*)/);
          const url = values ? values[1] : undefined;
          query = url ? url.split('?')[1] : undefined;
          if (query) {
            const queryParams = qs.parse(query);

            page = queryParams['page'];
            perPage = queryParams['per_page'];
          }

          let param = { [current.value.link]: url, page, perPage };
          if (current.value.link === 'last') {
            const totalCount = { totalCount: page * perPage };
            param = { ...totalCount, ...param };
          }
          params = { ...param, ...params };
        }
        current = iterator.next();
      }
      console.log(params);
      return params;
    });
  };
}

const linkGenerator = function*(): Generator<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  link: string;
}> {
  yield { link: 'prev' };
  yield { link: 'next' };
  yield { link: 'last' };

  return;
};

interface ParsedGitHubLinkHeader {
  prev?: string | null;
  next?: string | null;
  page: number;
  perPage: number;
  totalCount: number;
}
