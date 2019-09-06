import { Container, tagged } from 'inversify';
import { JavaScriptComponentDetector } from '../../detectors/JavaScript/JavaScriptComponentDetector';
import { FileInspector } from '../../inspectors/FileInspector';
import { JavaScriptPackageInspector } from '../../inspectors/package/JavaScriptPackageInspector';
import { LanguageAtPath, ProgrammingLanguage } from '../../model';
import { LanguageContextFactory, Types } from '../../types';
import { bindProjectComponentContext } from '../projectComponent/projectComponentContextBinding';
import { LanguageContext } from './LanguageContext';

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

  bindFileAccess(languageAtPath, container);
  bindComponentDetectors(container);
  bindProjectComponentContext(container);
  bindPackageInspectors(languageAtPath, container);

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

  container.bind(Types.ProjectComponentDetectorFactory).toFactory((ctx) => {
    return getProjectComponentDetectorFactory(ctx.container as Container);
  });
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
