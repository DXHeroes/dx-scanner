import { injectable, inject } from 'inversify';
import { Types, PracticeContextFactory } from '../../types';
import { ProgrammingLanguage, ProjectComponent } from '../../model';
import { PracticeContext } from '../practice/PracticeContext';
import { ConfigProvider } from '../ConfigProvider';

@injectable()
export class ProjectComponentContext {
  readonly projectComponent: ProjectComponent;
  private readonly practiceContextFactory: PracticeContextFactory;
  private readonly configProvider: ConfigProvider;

  constructor(
    @inject(Types.ProjectComponent) projectComponent: ProjectComponent,
    @inject(Types.PracticeContextFactory) practiceContextFactory: PracticeContextFactory,
    @inject(Types.ConfigProvider) configProvider: ConfigProvider,
  ) {
    this.projectComponent = projectComponent;
    this.practiceContextFactory = practiceContextFactory;
    this.configProvider = configProvider;
  }

  initConfigProvider() {
    return this.configProvider.init();
  }

  get config(): any {
    return this.configProvider.config;
  }

  get path(): string {
    return this.projectComponent.path;
  }
  get language(): ProgrammingLanguage {
    return this.projectComponent.language;
  }

  getPracticeContext(): PracticeContext {
    return this.practiceContextFactory(this.projectComponent);
  }
}
