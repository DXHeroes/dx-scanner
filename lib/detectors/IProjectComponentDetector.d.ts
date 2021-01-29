import { LanguageAtPath, ProjectComponent } from '../model';
export interface IProjectComponentDetector {
    detectComponent(langAtPath: LanguageAtPath): Promise<ProjectComponent[]>;
}
//# sourceMappingURL=IProjectComponentDetector.d.ts.map