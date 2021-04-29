"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindScanningContext = void 0;
const BranchesCollector_1 = require("../../collectors/BranchesCollector");
const ContributorsCollector_1 = require("../../collectors/ContributorsCollector");
const ServiceDataCollector_1 = require("../../collectors/ServiceDataCollector");
const GoLanguageDetector_1 = require("../../detectors/Go/GoLanguageDetector");
const IScanningStrategy_1 = require("../../detectors/IScanningStrategy");
const JavaLanguageDetector_1 = require("../../detectors/Java/JavaLanguageDetector");
const JavaScriptLanguageDetector_1 = require("../../detectors/JavaScript/JavaScriptLanguageDetector");
const PHPLanguageDetector_1 = require("../../detectors/PHP/PHPLanguageDetector");
const PythonLanguageDetector_1 = require("../../detectors/Python/PythonLanguageDetector");
const RustLanguageDetector_1 = require("../../detectors/Rust/RustLanguageDetector");
const FileInspector_1 = require("../../inspectors/FileInspector");
const GitInspector_1 = require("../../inspectors/GitInspector");
const reporters_1 = require("../../reporters");
const services_1 = require("../../services");
const FileSystemService_1 = require("../../services/FileSystemService");
const GitLabService_1 = require("../../services/gitlab/GitLabService");
const types_1 = require("../../types");
const languageContextBinding_1 = require("../language/languageContextBinding");
const ScannerContext_1 = require("./ScannerContext");
exports.bindScanningContext = (container) => {
    container.bind(types_1.Types.ScannerContextFactory).toFactory(() => {
        //d('bindScanningContext');
        return (scanningStrategy) => {
            const scanningContextContainer = createScanningContainer(scanningStrategy, container);
            return scanningContextContainer.get(ScannerContext_1.ScannerContext);
        };
    });
};
const createScanningContainer = (scanningStrategy, discoveryContainer) => {
    //d('createScanningContainer');
    const container = discoveryContainer.createChild();
    container.bind(types_1.Types.ScanningStrategy).toConstantValue(scanningStrategy);
    const args = container.get(types_1.Types.ArgumentsProvider);
    bindLanguageDetectors(container);
    languageContextBinding_1.bindLanguageContext(container);
    bindFileAccess(scanningStrategy, container);
    bindReporters(container, args, scanningStrategy);
    bindCollectors(container, args, scanningStrategy.accessType);
    container.bind(ScannerContext_1.ScannerContext).toSelf();
    return container;
};
const bindFileAccess = (scanningStrategy, container) => {
    //d('bindFileAccess');
    //d(JSON.stringify(scanningStrategy));
    console.log({ scanningStrategy });
    if (scanningStrategy.localPath) {
        container.bind(types_1.Types.FileInspectorBasePath).toConstantValue(scanningStrategy.localPath);
        container.bind(types_1.Types.IProjectFilesBrowser).to(FileSystemService_1.FileSystemService);
        container.bind(types_1.Types.RepositoryPath).toConstantValue(scanningStrategy.localPath);
        container.bind(types_1.Types.IGitInspector).to(GitInspector_1.GitInspector);
    }
    if (scanningStrategy.serviceType === IScanningStrategy_1.ServiceType.github) {
        container.bind(types_1.Types.IContentRepositoryBrowser).to(services_1.GitHubService);
    }
    if (scanningStrategy.serviceType === IScanningStrategy_1.ServiceType.bitbucket) {
        container.bind(types_1.Types.IContentRepositoryBrowser).to(services_1.BitbucketService);
    }
    if (scanningStrategy.serviceType === IScanningStrategy_1.ServiceType.gitlab) {
        container.bind(types_1.Types.IContentRepositoryBrowser).to(GitLabService_1.GitLabService);
    }
    container.bind(types_1.Types.IFileInspector).to(FileInspector_1.FileInspector).inSingletonScope();
};
const bindCollectors = (container, args, accessType) => {
    if ((accessType === IScanningStrategy_1.AccessType.private && args.apiToken) || accessType === IScanningStrategy_1.AccessType.public) {
        container.bind(ContributorsCollector_1.ContributorsCollector).toSelf().inSingletonScope();
        container.bind(BranchesCollector_1.BranchesCollector).toSelf().inSingletonScope();
        container.bind(ServiceDataCollector_1.ServiceDataCollector).toSelf().inSingletonScope();
    }
};
const bindReporters = (container, args, { accessType, localPath }) => {
    if (args.json) {
        container.bind(types_1.Types.IReporter).to(reporters_1.JSONReporter);
    }
    else if (args.html) {
        container.bind(types_1.Types.IReporter).to(reporters_1.HTMLReporter);
    }
    else if (args.fix && !localPath) {
        // fix only local runs
        container.bind(types_1.Types.IReporter).to(reporters_1.FixReporter);
    }
    else {
        container.bind(types_1.Types.IReporter).to(reporters_1.CLIReporter);
    }
    if (args.ci) {
        container.bind(types_1.Types.IReporter).to(reporters_1.CIReporter);
    }
    if (args.apiToken || accessType === IScanningStrategy_1.AccessType.public) {
        container.bind(types_1.Types.IReporter).to(reporters_1.DashboardReporter);
    }
};
const bindLanguageDetectors = (container) => {
    container.bind(types_1.Types.ILanguageDetector).to(JavaScriptLanguageDetector_1.JavaScriptLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(JavaLanguageDetector_1.JavaLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(PythonLanguageDetector_1.PythonLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(GoLanguageDetector_1.GoLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(PHPLanguageDetector_1.PHPLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(RustLanguageDetector_1.RustLanguageDetector);
};
//# sourceMappingURL=scannerContextBinding.js.map