import { Container, tagged } from 'inversify';
import { JavaScriptComponentDetector } from '../../detectors/JavaScript/JavaScriptComponentDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { JavaScriptPackageInspector } from '../../inspectors/package/JavaScriptPackageInspector';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { LanguageContextFactory, Types } from '../../types';
import { bindProjectComponentContext } from '../projectComponent/projectComponentContextBinding';
import { JavaPackageInspector } from '../../inspectors/package/JavaPackageInspector';
import { JavaComponentDetector } from '../../detectors/Java/JavaComponentDetector';
import { LanguageContext } from './LanguageContext';
import { CollaborationInspector } from '../../inspectors/CollaborationInspector';
import { IssueTrackingInspector } from '../../inspectors/IssueTrackingInspector';
import { PythonComponentDetector } from '../../detectors/Python/PythonComponentDetector';
import { PythonPackageInspector } from '../../inspectors/package/PythonPackageInspector';

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
  container.bind(Types.IRootFileInspector).toConstantValue(container.get(Types.IFileInspector));

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

  container
    .bind(Types.IFileInspector)
    .to(FileInspector)
    .inSingletonScope();
};

const bindPackageInspectors = (languageAtPath: LanguageAtPath, container: Container) => {
  if (languageAtPath.language === ProgrammingLanguage.JavaScript || languageAtPath.language === ProgrammingLanguage.TypeScript) {
    container
      .bind(Types.IPackageInspector)
      .to(JavaScriptPackageInspector)
      .inSingletonScope();

    // TODO: bind this as InitiableInspector instead of using next line binding
    container.bind(JavaScriptPackageInspector).toDynamicValue((ctx) => {
      return ctx.container.get(Types.IPackageInspector);
    });
    container.bind(Types.InitiableInspector).toDynamicValue((ctx) => {
      return ctx.container.get(Types.IPackageInspector);
    });
  } else if (languageAtPath.language === ProgrammingLanguage.Java || languageAtPath.language === ProgrammingLanguage.Kotlin) {
    container
      .bind(Types.IPackageInspector)
      .to(JavaPackageInspector)
      .inSingletonScope();
    container.bind(JavaPackageInspector).toDynamicValue((ctx) => {
      return ctx.container.get(Types.IPackageInspector);
    });
    container.bind(Types.InitiableInspector).toDynamicValue((ctx) => {
      return ctx.container.get(Types.IPackageInspector);
    });
  } else if (languageAtPath.language === ProgrammingLanguage.Python) {
    container
      .bind(Types.IPackageInspector)
      .to(PythonPackageInspector)
      .inSingletonScope();
    container.bind(PythonPackageInspector).toDynamicValue((ctx) => {
      return ctx.container.get(Types.IPackageInspector);
    });
    container.bind(Types.InitiableInspector).toDynamicValue((ctx) => {
      return ctx.container.get(Types.IPackageInspector);
    });
  }
};

const bindComponentDetectors = (container: Container) => {
  container
    .bind(Types.IProjectComponentDetector)
    .to(JavaScriptComponentDetector)
    .whenTargetTagged(DETECT_LANGUAGE_TAG, ProgrammingLanguage.JavaScript);
  container
    .bind(Types.IProjectComponentDetector)
    .to(JavaScriptComponentDetector)
    .whenTargetTagged(DETECT_LANGUAGE_TAG, ProgrammingLanguage.TypeScript);
  container
    .bind(Types.IProjectComponentDetector)
    .to(JavaComponentDetector)
    .whenTargetTagged(DETECT_LANGUAGE_TAG, ProgrammingLanguage.Java);
  container
    .bind(Types.IProjectComponentDetector)
    .to(JavaComponentDetector)
    .whenTargetTagged(DETECT_LANGUAGE_TAG, ProgrammingLanguage.Kotlin);
  container
    .bind(Types.IProjectComponentDetector)
    .to(PythonComponentDetector)
    .whenTargetTagged(DETECT_LANGUAGE_TAG, ProgrammingLanguage.Python);

  container.bind(Types.ProjectComponentDetectorFactory).toFactory((ctx) => {
    return getProjectComponentDetectorFactory(ctx.container as Container);
  });
};

const bindCollaborationInspectors = (container: Container) => {
  container
    .bind(Types.ICollaborationInspector)
    .to(CollaborationInspector)
    .inSingletonScope();
  container
    .bind(Types.IIssueTrackingInspector)
    .to(IssueTrackingInspector)
    .inSingletonScope();
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
