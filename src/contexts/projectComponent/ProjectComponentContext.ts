import { injectable, inject } from 'inversify';
import { Types, PracticeContextFactory } from '../../types';
import { ProgrammingLanguage, ProjectComponent } from '../../model';
import { PracticeContext } from '../practice/PracticeContext';
import { ContextBase } from '../ContextBase';

@injectable()
export class ProjectComponentContext extends ContextBase {
  readonly projectComponent: ProjectComponent;
  get path(): string {
    return this.projectComponent.path;
  }
  get language(): ProgrammingLanguage {
    return this.projectComponent.language;
  }
  private readonly practiceContextFactory: PracticeContextFactory;

  constructor(
    @inject(Types.ProjectComponent) projectComponent: ProjectComponent,
    @inject(Types.PracticeContextFactory) practiceContextFactory: PracticeContextFactory,
  ) {
    super();
    this.projectComponent = projectComponent;
    this.practiceContextFactory = practiceContextFactory;
  }

  async init(): Promise<void> {
    //throw new Error('Method not implemented.');
  }

  getPracticeContext(): PracticeContext {
    return this.practiceContextFactory(this.projectComponent);
  }
}
