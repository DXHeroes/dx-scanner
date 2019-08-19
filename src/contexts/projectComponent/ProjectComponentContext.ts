import { injectable, inject } from 'inversify';
import { Types, PracticeContextFactory } from '../../types';
import { ProgrammingLanguage, ProjectComponent } from '../../model';
import { PracticeContext } from '../practice/PracticeContext';

@injectable()
export class ProjectComponentContext {
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
    this.projectComponent = projectComponent;
    this.practiceContextFactory = practiceContextFactory;
  }

  getPracticeContext(): PracticeContext {
    return this.practiceContextFactory(this.projectComponent);
  }
}
