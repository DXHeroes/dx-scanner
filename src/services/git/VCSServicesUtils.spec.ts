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
});
