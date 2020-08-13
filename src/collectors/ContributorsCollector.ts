import { injectable, inject } from 'inversify';
import { ProjectComponentAndLangContext } from '../scanner';
import { GitInspector } from '../inspectors';
import { Types } from '../types';

@injectable()
export class ContributorsCollector {
  private readonly gitInspector: GitInspector;
  constructor(@inject(Types.IGitInspector) gitInspector: GitInspector) {
    this.gitInspector = gitInspector;
  }
  async collectData(projectComponents: ProjectComponentAndLangContext[]): Promise<Contributor[]> {
    const data = await this.gitInspector.getAuthors({});
    return data.items;
  }
}
//FIX - move and change properties
export type Contributor = { name: string; email: string };
