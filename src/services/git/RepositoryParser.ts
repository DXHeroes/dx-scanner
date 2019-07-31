import { DeprecatedProjectComponent, Repository } from '../../model';
import { injectable, inject } from 'inversify';
import { Types, GitFactory } from '../../types';
import { JavascriptComponentDetector } from '../../detectors/javascript';
import { GitInfoObtainer } from './GitInfoObtainer';
import Debug from 'debug';
const debug = Debug('cli:services:git:repository-parser');

@injectable()
export class RepositoryParser {
  private gitFactory: GitFactory;

  constructor(@inject(Types.GitFactory) gitFactory: GitFactory) {
    this.gitFactory = gitFactory;
  }

  async parse(repository: Repository): Promise<DeprecatedProjectComponent[]> {
    const git = this.gitFactory(repository);
    // todo - find out if we need this?
    // const dir = await git.listDirectory('/');
    const javascriptDetector = new JavascriptComponentDetector(git);
    const resultFromDetector = await javascriptDetector.detect();
    const gitInfoObtainer = new GitInfoObtainer(git);
    const gitInfo = await gitInfoObtainer.obtainInfo();
    const result = resultFromDetector.map((r) => {
      return {
        ...r,
        githubUrl: repository.url,
        git: gitInfo,
      };
    });
    debug(result);
    return result;
  }
}
