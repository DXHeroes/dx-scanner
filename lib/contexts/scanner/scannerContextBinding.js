"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindScanningContext = void 0;
const JavaScriptLanguageDetector_1 = require("../../detectors/JavaScript/JavaScriptLanguageDetector");
const JavaLanguageDetector_1 = require("../../detectors/Java/JavaLanguageDetector");
const FileInspector_1 = require("../../inspectors/FileInspector");
const GitInspector_1 = require("../../inspectors/GitInspector");
const FileSystemService_1 = require("../../services/FileSystemService");
const GitHubService_1 = require("../../services/git/GitHubService");
const types_1 = require("../../types");
const languageContextBinding_1 = require("../language/languageContextBinding");
const ScannerContext_1 = require("./ScannerContext");
const BitbucketService_1 = require("../../services/bitbucket/BitbucketService");
const GitLabService_1 = require("../../services/gitlab/GitLabService");
const PythonLanguageDetector_1 = require("../../detectors/Python/PythonLanguageDetector");
const GoLanguageDetector_1 = require("../../detectors/Go/GoLanguageDetector");
const PHPLanguageDetector_1 = require("../../detectors/PHP/PHPLanguageDetector");
const reporters_1 = require("../../reporters");
const IScanningStrategy_1 = require("../../detectors/IScanningStrategy");
const BranchesCollector_1 = require("../../collectors/BranchesCollector");
const ContributorsCollector_1 = require("../../collectors/ContributorsCollector");
const DataCollector_1 = require("../../collectors/DataCollector");
const debug_1 = __importDefault(require("debug"));
const d = debug_1.default('scanner');
exports.bindScanningContext = (container) => {
    container.bind(types_1.Types.ScannerContextFactory).toFactory(() => {
        d('bindScanningContext');
        return (scanningStrategy) => {
            const scanningContextContainer = createScanningContainer(scanningStrategy, container);
            return scanningContextContainer.get(ScannerContext_1.ScannerContext);
        };
    });
};
const createScanningContainer = (scanningStrategy, discoveryContainer) => {
    d('createScanningContainer');
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
    d('bindFileAccess');
    d(JSON.stringify(scanningStrategy));
    console.log({ scanningStrategy });
    if (scanningStrategy.localPath) {
        container.bind(types_1.Types.FileInspectorBasePath).toConstantValue(scanningStrategy.localPath);
        container.bind(types_1.Types.IProjectFilesBrowser).to(FileSystemService_1.FileSystemService);
        container.bind(types_1.Types.RepositoryPath).toConstantValue(scanningStrategy.localPath);
        container.bind(types_1.Types.IGitInspector).to(GitInspector_1.GitInspector);
    }
    if (scanningStrategy.serviceType === IScanningStrategy_1.ServiceType.github) {
        container.bind(types_1.Types.IContentRepositoryBrowser).to(GitHubService_1.GitHubService);
    }
    if (scanningStrategy.serviceType === IScanningStrategy_1.ServiceType.bitbucket) {
        container.bind(types_1.Types.IContentRepositoryBrowser).to(BitbucketService_1.BitbucketService);
    }
    if (scanningStrategy.serviceType === IScanningStrategy_1.ServiceType.gitlab) {
        container.bind(types_1.Types.IContentRepositoryBrowser).to(GitLabService_1.GitLabService);
    }
    container.bind(types_1.Types.IFileInspector).to(FileInspector_1.FileInspector).inSingletonScope();
};
const bindCollectors = (container, args, accessType) => {
    if (accessType === IScanningStrategy_1.AccessType.public || (accessType === IScanningStrategy_1.AccessType.private && args.apiToken)) {
        container.bind(ContributorsCollector_1.ContributorsCollector).toSelf().inSingletonScope();
        container.bind(BranchesCollector_1.BranchesCollector).toSelf().inSingletonScope();
        container.bind(DataCollector_1.DataCollector).toSelf().inSingletonScope();
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
    if (accessType === IScanningStrategy_1.AccessType.public || (accessType === IScanningStrategy_1.AccessType.private && args.apiToken)) {
        container.bind(types_1.Types.IReporter).to(reporters_1.DashboardReporter);
    }
};
const bindLanguageDetectors = (container) => {
    container.bind(types_1.Types.ILanguageDetector).to(JavaScriptLanguageDetector_1.JavaScriptLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(JavaLanguageDetector_1.JavaLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(PythonLanguageDetector_1.PythonLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(GoLanguageDetector_1.GoLanguageDetector);
    container.bind(types_1.Types.ILanguageDetector).to(PHPLanguageDetector_1.PHPLanguageDetector);
};
//# sourceMappingURL=scannerContextBinding.js.map