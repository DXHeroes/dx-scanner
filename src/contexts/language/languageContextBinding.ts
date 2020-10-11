import { Container, tagged } from 'inversify';
import { JavaScriptComponentDetector } from '../../detectors/JavaScript/JavaScriptComponentDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { JavaScriptPackageInspector } from '../../inspectors/package/JavaScriptPackageInspector';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { LanguageContextFactory, Types } from '../../types';
import { bindProjectComponentContext } from '../projectComponent/projectComponentContextBinding';
import { JavaPackageInspector } from '../../inspectors/package/JavaPackageInspector';
import { JavaComponentDetector } from '../../detectors/Java/JavaComponentDetector';
import { GoPackageInspector } from '../../inspectors/package/GoPackageInspector';
import { GoComponentDetector } from '../../detectors/Go/GoComponentDetector';
import { LanguageContext } from './LanguageContext';
import { CollaborationInspector } from '../../inspectors/CollaborationInspector';
import { IssueTrackingInspector } from '../../inspectors/IssueTrackingInspector';
import { PythonComponentDetector } from '../../detectors/Python/PythonComponentDetector';
import { PythonPackageInspector } from '../../inspectors/package/PythonPackageInspector';
import { PackageInspectorBase } from '../../inspectors/package/PackageInspectorBase';
import { IProjectComponentDetector } from '../../detectors/IProjectComponentDetector';
import { ScanningStrategy } from '../../detectors';
import { ProjectFilesBrowserService } from '../../services';
import { AndroidComponentDetector } from '../../detectors/Android/AndroidComponentDetector';

export const bindLanguageContext = (container: Container) => {
  container.bind(Types.LanguageContextFactory).toFactory(
    (ctx): LanguageContextFactory => {
      return (languageAtPath: LanguageAtPath) => {
        const scanningContextContainer = createLanguageContainer(languageAtPath, ctx.container as Container);
        return scanningContextContainer.get(LanguageContext);
      };
    },
  );
};

const createLanguageContainer = (languageAtPath: LanguageAtPath, rootContainer: Container): Container => {
  const container = rootContainer.createChild();
  container.bind(Types.LanguageAtPath).toConstantValue(languageAtPath);
  const scanningStrategy = container.get<ScanningStrategy>(Types.ScanningStrategy);

  const projectFilesBrowserService = container.get<ProjectFilesBrowserService>(Types.IProjectFilesBrowser);
  const fileInspector = container.get<FileInspector>(Types.IFileInspector);
  const fileInspectorForRoot = new FileInspector(projectFilesBrowserService, scanningStrategy.rootPath || fileInspector.basePath);
  container.bind(Types.IRootFileInspector).toConstantValue(fileInspectorForRoot);

  bindFileAccess(languageAtPath, container);
  bindComponentDetectors(container);
  bindProjectComponentContext(container);
  bindPackageInspectors(languageAtPath, container);
  bindCollaborationInspectors(container);

  container.bind(LanguageContext).toSelf();
  return container;
};

const bindFileAccess = (languageAtPath: LanguageAtPath, container: Container) => {
  container.bind(Types.FileInspectorBasePath).toConstantValue(languageAtPath.path);

  container.bind(Types.IFileInspector).to(FileInspector).inSingletonScope();
};

const bindPackageInspectors = (languageAtPath: LanguageAtPath, container: Container) => {
  // do not refactor to switch cases => it changes the behaviour unexpectedly in some tests
  if (languageAtPath.language === ProgrammingLanguage.JavaScript || languageAtPath.language === ProgrammingLanguage.TypeScript) {
    resolveBindingPackageInspector(JavaScriptPackageInspector, container);
  } else if (languageAtPath.language === ProgrammingLanguage.Java || languageAtPath.language === ProgrammingLanguage.Kotlin) {
    resolveBindingPackageInspector(JavaPackageInspector, container);
  } else if (languageAtPath.language === ProgrammingLanguage.Python) {
    resolveBindingPackageInspector(PythonPackageInspector, container);
  } else if (languageAtPath.language === ProgrammingLanguage.Go) {
    resolveBindingPackageInspector(GoPackageInspector, container);
  }
};

const bindComponentDetectors = (container: Container) => {
  const iterator = componentGenerator();
  let current = iterator.next();
  while (!current.done) {
    container
      .bind(Types.IProjectComponentDetector)
      .to(current.value.componentDetector)
      .whenTargetTagged(DETECT_LANGUAGE_TAG, current.value.detectedLanguage);
    current = iterator.next();
  }

  container.bind(Types.ProjectComponentDetectorFactory).toFactory((ctx) => {
    return getProjectComponentDetectorFactory(ctx.container as Container);
  });
};

const bindCollaborationInspectors = (container: Container) => {
  container.bind(Types.ICollaborationInspector).to(CollaborationInspector).inSingletonScope();
  container.bind(Types.IIssueTrackingInspector).to(IssueTrackingInspector).inSingletonScope();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveBindingPackageInspector = (packageInspector: { new (...args: any[]): PackageInspectorBase }, container: Container) => {
  container.bind(Types.IPackageInspector).to(packageInspector).inSingletonScope();
  // TODO: bind this as InitiableInspector instead of using next line binding
  container.bind(packageInspector).toDynamicValue((ctx) => {
    return ctx.container.get(Types.IPackageInspector);
  });
  container.bind(Types.InitiableInspector).toDynamicValue((ctx) => {
    return ctx.container.get(Types.IPackageInspector);
  });
};

const componentGenerator = function* (): Generator<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentDetector: { new (...args: any[]): IProjectComponentDetector };
  detectedLanguage: ProgrammingLanguage;
}> {
  yield { componentDetector: JavaScriptComponentDetector, detectedLanguage: ProgrammingLanguage.JavaScript };
  yield { componentDetector: JavaScriptComponentDetector, detectedLanguage: ProgrammingLanguage.TypeScript };
  yield { componentDetector: JavaComponentDetector, detectedLanguage: ProgrammingLanguage.Java };
  yield { componentDetector: JavaComponentDetector, detectedLanguage: ProgrammingLanguage.Kotlin };
  yield { componentDetector: PythonComponentDetector, detectedLanguage: ProgrammingLanguage.Python };
  yield { componentDetector: GoComponentDetector, detectedLanguage: ProgrammingLanguage.Go };
  yield { componentDetector: AndroidComponentDetector, detectedLanguage: ProgrammingLanguage.Java };
  yield { componentDetector: AndroidComponentDetector, detectedLanguage: ProgrammingLanguage.Kotlin };
  return;
};

export const DETECT_LANGUAGE_TAG = 'language';
/**
 * Language tag for Project Component Detector. Determines which language this detector supports
 * @param language Language this detector is able to detect
 */
export const detectsLanguage = (language: ProgrammingLanguage) => {
  return tagged(DETECT_LANGUAGE_TAG, language);
};

export const getProjectComponentDetectorFactory = (container: Container) => {
  return (language: ProgrammingLanguage) => {
    const detectors = container.getAllTagged(Types.IProjectComponentDetector, DETECT_LANGUAGE_TAG, language);
    return detectors;
  };
};
