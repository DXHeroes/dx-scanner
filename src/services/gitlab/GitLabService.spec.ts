import { argumentsProviderFactory } from '../../test/factories/ArgumentsProviderFactory';
import { GitLabService } from './GitLabService';

describe('GitLab Service', () => {
  let service: GitLabService;
  //let bitbucketNock: BitbucketNock;

  beforeEach(async () => {
    service = new GitLabService(argumentsProviderFactory({ uri: '.' }));

    //bitbucketNock = new BitbucketNock('pypy', 'pypy');
  });

  it('returns object', async () => {
    const response = await service.getRepo('caina', 'time-sheet');
    expect(response).toBeDefined();
  });
});
