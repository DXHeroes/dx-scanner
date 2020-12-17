"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectComponentDetectorFactory = exports.detectsLanguage = exports.DETECT_LANGUAGE_TAG = exports.bindLanguageContext = void 0;
const inversify_1 = require("inversify");
const JavaScriptComponentDetector_1 = require("../../detectors/JavaScript/JavaScriptComponentDetector");
const FileInspector_1 = require("../../inspectors/FileInspector");
const JavaScriptPackageInspector_1 = require("../../inspectors/package/JavaScriptPackageInspector");
const model_1 = require("../../model");
const types_1 = require("../../types");
const projectComponentContextBinding_1 = require("../projectComponent/projectComponentContextBinding");
const JavaPackageInspector_1 = require("../../inspectors/package/JavaPackageInspector");
const JavaComponentDetector_1 = require("../../detectors/Java/JavaComponentDetector");
const GoPackageInspector_1 = require("../../inspectors/package/GoPackageInspector");
const GoComponentDetector_1 = require("../../detectors/Go/GoComponentDetector");
const LanguageContext_1 = require("./LanguageContext");
const CollaborationInspector_1 = require("../../inspectors/CollaborationInspector");
const IssueTrackingInspector_1 = require("../../inspectors/IssueTrackingInspector");
const PythonComponentDetector_1 = require("../../detectors/Python/PythonComponentDetector");
const PythonPackageInspector_1 = require("../../inspectors/package/PythonPackageInspector");
const PHPComponentDetector_1 = require("../../detectors/PHP/PHPComponentDetector");
const PHPPackageInspector_1 = require("../../inspectors/package/PHPPackageInspector");
exports.bindLanguageContext = (container) => {
    container.bind(types_1.Types.LanguageContextFactory).toFactory((ctx) => {
        return (languageAtPath) => {
            const scanningContextContainer = createLanguageContainer(languageAtPath, ctx.container);
            return scanningContextContainer.get(LanguageContext_1.LanguageContext);
        };
    });
};
const createLanguageContainer = (languageAtPath, rootContainer) => {
    const container = rootContainer.createChild();
    container.bind(types_1.Types.LanguageAtPath).toConstantValue(languageAtPath);
    const scanningStrategy = container.get(types_1.Types.ScanningStrategy);
    console.log('create language container');
    const projectFilesBrowserService = container.get(types_1.Types.IProjectFilesBrowser);
    const fileInspector = container.get(types_1.Types.IFileInspector);
    const fileInspectorForRoot = new FileInspector_1.FileInspector(projectFilesBrowserService, scanningStrategy.rootPath || fileInspector.basePath);
    container.bind(types_1.Types.IRootFileInspector).toConstantValue(fileInspectorForRoot);
    bindFileAccess(languageAtPath, container);
    bindComponentDetectors(container);
    projectComponentContextBinding_1.bindProjectComponentContext(container);
    bindPackageInspectors(languageAtPath, container);
    bindCollaborationInspectors(container);
    container.bind(LanguageContext_1.LanguageContext).toSelf();
    return container;
};
const bindFileAccess = (languageAtPath, container) => {
    container.bind(types_1.Types.FileInspectorBasePath).toConstantValue(languageAtPath.path);
    container.bind(types_1.Types.IFileInspector).to(FileInspector_1.FileInspector).inSingletonScope();
};
const bindPackageInspectors = (languageAtPath, container) => {
    // do not refactor to switch cases => it changes the behaviour unexpectedly in some tests
    if (languageAtPath.language === model_1.ProgrammingLanguage.JavaScript || languageAtPath.language === model_1.ProgrammingLanguage.TypeScript) {
        resolveBindingPackageInspector(JavaScriptPackageInspector_1.JavaScriptPackageInspector, container);
    }
    else if (languageAtPath.language === model_1.ProgrammingLanguage.Java || languageAtPath.language === model_1.ProgrammingLanguage.Kotlin) {
        resolveBindingPackageInspector(JavaPackageInspector_1.JavaPackageInspector, container);
    }
    else if (languageAtPath.language === model_1.ProgrammingLanguage.Python) {
        resolveBindingPackageInspector(PythonPackageInspector_1.PythonPackageInspector, container);
    }
    else if (languageAtPath.language === model_1.ProgrammingLanguage.Go) {
        resolveBindingPackageInspector(GoPackageInspector_1.GoPackageInspector, container);
    }
    else if (languageAtPath.language === model_1.ProgrammingLanguage.PHP) {
        resolveBindingPackageInspector(PHPPackageInspector_1.PHPPackageInspector, container);
    }
};
const bindComponentDetectors = (container) => {
    const iterator = componentGenerator();
    let current = iterator.next();
    while (!current.done) {
        container
            .bind(types_1.Types.IProjectComponentDetector)
            .to(current.value.componentDetector)
            .whenTargetTagged(exports.DETECT_LANGUAGE_TAG, current.value.detectedLanguage);
        current = iterator.next();
    }
    container.bind(types_1.Types.ProjectComponentDetectorFactory).toFactory((ctx) => {
        return exports.getProjectComponentDetectorFactory(ctx.container);
    });
};
const bindCollaborationInspectors = (container) => {
    container.bind(types_1.Types.ICollaborationInspector).to(CollaborationInspector_1.CollaborationInspector).inSingletonScope();
    container.bind(types_1.Types.IIssueTrackingInspector).to(IssueTrackingInspector_1.IssueTrackingInspector).inSingletonScope();
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveBindingPackageInspector = (packageInspector, container) => {
    container.bind(types_1.Types.IPackageInspector).to(packageInspector).inSingletonScope();
    // TODO: bind this as InitiableInspector instead of using next line binding
    container.bind(packageInspector).toDynamicValue((ctx) => {
        return ctx.container.get(types_1.Types.IPackageInspector);
    });
    container.bind(types_1.Types.InitiableInspector).toDynamicValue((ctx) => {
        return ctx.container.get(types_1.Types.IPackageInspector);
    });
};
const componentGenerator = function* () {
    yield { componentDetector: JavaScriptComponentDetector_1.JavaScriptComponentDetector, detectedLanguage: model_1.ProgrammingLanguage.JavaScript };
    yield { componentDetector: JavaScriptComponentDetector_1.JavaScriptComponentDetector, detectedLanguage: model_1.ProgrammingLanguage.TypeScript };
    yield { componentDetector: JavaComponentDetector_1.JavaComponentDetector, detectedLanguage: model_1.ProgrammingLanguage.Java };
    yield { componentDetector: JavaComponentDetector_1.JavaComponentDetector, detectedLanguage: model_1.ProgrammingLanguage.Kotlin };
    yield { componentDetector: PythonComponentDetector_1.PythonComponentDetector, detectedLanguage: model_1.ProgrammingLanguage.Python };
    yield { componentDetector: GoComponentDetector_1.GoComponentDetector, detectedLanguage: model_1.ProgrammingLanguage.Go };
    yield { componentDetector: PHPComponentDetector_1.PHPComponentDetector, detectedLanguage: model_1.ProgrammingLanguage.PHP };
    return;
};
exports.DETECT_LANGUAGE_TAG = 'language';
/**
 * Language tag for Project Component Detector. Determines which language this detector supports
 * @param language Language this detector is able to detect
 */
exports.detectsLanguage = (language) => {
    return inversify_1.tagged(exports.DETECT_LANGUAGE_TAG, language);
};
exports.getProjectComponentDetectorFactory = (container) => {
    return (language) => {
        const detectors = container.getAllTagged(types_1.Types.IProjectComponentDetector, exports.DETECT_LANGUAGE_TAG, language);
        return detectors;
    };
};
//# sourceMappingURL=languageContextBinding.js.map