import { VCSServicesUtils } from './VCSServicesUtils';
import { BitbucketIssueState } from '../bitbucket/IBitbucketService';

describe('VCSServicesUtils', () => {
  it('returns right query paramater for one state', () => {
    const response = VCSServicesUtils.getBitbucketStateQueryParam(BitbucketIssueState.new);
    expect(response).toEqual(`state="${BitbucketIssueState.new}"`);
  });

  it('returns right query paramater for one state in array', () => {
    const response = VCSServicesUtils.getBitbucketStateQueryParam([BitbucketIssueState.new]);
    expect(response).toEqual(`state="${BitbucketIssueState.new}"`);
  });

  it('returns right query paramater for more than one state', () => {
    const response = VCSServicesUtils.getBitbucketStateQueryParam([BitbucketIssueState.new, BitbucketIssueState.closed]);
    expect(response).toEqual(`state="${BitbucketIssueState.new}"+OR+state="${BitbucketIssueState.closed}"`);
  });

  it('returns right query paramater for more than one state', () => {
    const response = VCSServicesUtils.getBitbucketStateQueryParam(undefined);
    expect(response).not.toBeDefined();
  });

  it('returns parsed github link header values if there are prev, next, last and first rel', () => {
    const response = VCSServicesUtils.parseGitHubHeaderLink(
      `<https://api.github.com/repositories/199797123/issues?per_page=5&page=1>; rel="prev", <https://api.github.com/repositories/199797123/issues?per_page=5&page=3>; rel="next", <https://api.github.com/repositories/199797123/issues?per_page=5&page=3>; rel="last", <https://api.github.com/repositories/199797123/issues?per_page=5&page=1>; rel="first"`,
    );
    expect(response).toMatchObject({
      totalCount: 15,
      page: 2,
      perPage: '5',
      last: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=3',
      next: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=3',
      prev: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=1',
    });
  });

  it('returns parsed github link header values if only next and last rel are provided', () => {
    const response = VCSServicesUtils.parseGitHubHeaderLink(
      '<https://api.github.com/repositories/199797123/issues?per_page=5&page=2>; rel="next", <https://api.github.com/repositories/199797123/issues?per_page=5&page=4>; rel="last"',
    );
    expect(response).toMatchObject({
      totalCount: 20,
      page: 1,
      perPage: '5',
      last: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=4',
      next: 'https://api.github.com/repositories/199797123/issues?per_page=5&page=2',
    });
  });

  it('returns parsed github link header values if only prev and first rel are provided', () => {
    const response = VCSServicesUtils.parseGitHubHeaderLink(
      '<https://api.github.com/repositories/199797123/issues?per_page=10&page=1>; rel="prev", <https://api.github.com/repositories/199797123/issues?per_page=10&page=1>; rel="first"',
    );
    expect(response).toMatchObject({
      totalCount: 10,
      page: 2,
      perPage: '10',
      prev: 'https://api.github.com/repositories/199797123/issues?per_page=10&page=1',
    });
  });
});
