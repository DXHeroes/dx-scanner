import { injectable, inject, multiInject } from 'inversify';
import { Types, ProjectComponentDetectorFactory, ProjectComponentContextFactory } from '../../types';
import { IProjectComponentDetector } from '../../detectors/IProjectComponentDetector';
import { LanguageAtPath, ProgrammingLanguage, ProjectComponent } from '../../model';
import { ProjectComponentContext } from '../projectComponent/ProjectComponentContext';
import { ContextBase } from '../ContextBase';
import { IInitiable } from '../../lib/IInitable';

@injectable()
export class LanguageContext extends ContextBase {
  readonly languageAtPath: LanguageAtPath;
  private projectComponentDetectors: IProjectComponentDetector[] | undefined;
  private readonly projectComponentDetectorFactory: ProjectComponentDetectorFactory;
  private readonly projecComponentContextFactory: ProjectComponentContextFactory;
  private readonly initableInspectors: IInitiable[];

  constructor(
    @inject(Types.LanguageAtPath) languageAtPath: LanguageAtPath,
    @inject(Types.ProjectComponentDetectorFactory) projectComponentDetectorFactory: ProjectComponentDetectorFactory,
    @inject(Types.ProjectComponentContextFactory) projecComponentContextFactory: ProjectComponentContextFactory,
    @multiInject(Types.InitiableInspector) initableInspectors: IInitiable[],
  ) {
    super();
    this.languageAtPath = languageAtPath;
    this.projectComponentDetectorFactory = projectComponentDetectorFactory;
    this.projecComponentContextFactory = projecComponentContextFactory;
    this.initableInspectors = initableInspectors;
  }
  async init(): Promise<void> {
    await Promise.all(this.initableInspectors.map((initableInspector) => initableInspector.init()));
  }

  get path(): string {
    return this.languageAtPath.path;
  }

  get language(): ProgrammingLanguage {
    return this.languageAtPath.language;
  }

  getProjectComponentDetectors(): IProjectComponentDetector[] {
    if (!this.projectComponentDetectors) {
      this.projectComponentDetectors = this.projectComponentDetectorFactory(this.language);
    }
    return this.projectComponentDetectors;
  }

  getProjectComponentContext(component: ProjectComponent): ProjectComponentContext {
    return this.projecComponentContextFactory(component);
  }
}
