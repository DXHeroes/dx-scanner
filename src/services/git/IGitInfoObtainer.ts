import { GitInfo } from '../../model';

export interface IGetInfoObtainer {
  getGitInfo(): Promise<GitInfo>;
}
