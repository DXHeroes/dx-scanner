import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
import { inject } from 'inversify';
import { Types } from '../../types';
import { DependencyType } from '../IPackageInspector';
import * as xml2js from 'xml2js';

export class JavaPackageInspector extends PackageInspectorBase {
  private fileInspector: IFileInspector;
  private hasLockfileFile!: boolean;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    super();
    this.fileInspector = fileInspector;
  }

  async init(): Promise<void> {
    try {
      this.debug('JavaPackageInspector init started');
      const mavenFileString = await this.fileInspector.readFile('pom.xml');
      if (!mavenFileString) {
        const gradleFileString = await this.fileInspector.readFile('build.gradle');
      }
      const mavenJSON = xml2js.parseString(mavenFileString, (err, result) => {
        // testing the XML parser
        console.log(result);
        console.log(result.project.dependencies);
        console.log(result.project.dependencies.dependency);
        console.log(result.project.dependencies[0]);
        console.log(result.project.dependencies[1]);
      });
      this.packages = [];
      return;
    } catch {}
  }

  hasLockfile(): boolean {
    return false;
  }

  private addPackages(dependencies: { [name: string]: string } | undefined, depType: DependencyType) {
    return;
  }
}
