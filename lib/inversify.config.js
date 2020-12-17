"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestContainer = exports.createRootContainer = void 0;
const inversify_1 = require("inversify");
const discoveryContextBinding_1 = require("./contexts/discovery/discoveryContextBinding");
const detectors_1 = require("./detectors");
const packageJSONContents_mock_1 = require("./detectors/__MOCKS__/JavaScript/packageJSONContents.mock");
const inspectors_1 = require("./inspectors");
const model_1 = require("./model");
const practices_1 = require("./practices");
const scanner_1 = require("./scanner");
const ScanningStrategyExplorer_1 = require("./scanner/ScanningStrategyExplorer");
const services_1 = require("./services");
const GitLabService_1 = require("./services/gitlab/GitLabService");
const ArgumentsProviderFactory_1 = require("./test/factories/ArgumentsProviderFactory");
const types_1 = require("./types");
exports.createRootContainer = (args) => {
    const container = new inversify_1.Container();
    container.bind(types_1.Types.ArgumentsProvider).toConstantValue(args);
    container.bind(ScanningStrategyExplorer_1.ScanningStrategyExplorer).toSelf();
    discoveryContextBinding_1.bindDiscoveryContext(container);
    container.bind(scanner_1.Scanner).toSelf();
    container.bind(services_1.FileSystemService).toSelf();
    // register practices
    practices_1.practices.forEach((practice) => {
        container.bind(types_1.Types.Practice).toConstantValue(scanner_1.ScannerUtils.initPracticeWithMetadata(practice));
    });
    return container;
};
exports.createTestContainer = (args, structure, projectComponent) => {
    const container = exports.createRootContainer(ArgumentsProviderFactory_1.argumentsProviderFactory(args));
    if (!structure) {
        structure = {
            '/package.json': packageJSONContents_mock_1.packageJSONContents,
        };
    }
    const vfss = new services_1.FileSystemService({ isVirtual: true });
    vfss.setFileSystem(structure);
    const repositoryConfig = {
        baseUrl: undefined,
        host: undefined,
        protocol: undefined,
        remoteUrl: undefined,
    };
    // FileSystemService as default ProjectBrowser
    container.bind(types_1.Types.RepositoryConfig).toConstantValue(repositoryConfig);
    console.log('bind test browser');
    container.bind(types_1.Types.IProjectFilesBrowser).toConstantValue(vfss);
    container.bind(types_1.Types.IContentRepositoryBrowser).to(services_1.GitHubService);
    container.bind(types_1.Types.IFileInspector).to(inspectors_1.FileInspector);
    container.bind(types_1.Types.IPackageInspector).to(inspectors_1.JavaScriptPackageInspector);
    container.bind(types_1.Types.ICollaborationInspector).to(inspectors_1.CollaborationInspector);
    container.bind(types_1.Types.IIssueTrackingInspector).to(inspectors_1.IssueTrackingInspector);
    container.bind(detectors_1.ScanningStrategyDetector).toSelf();
    container.bind(services_1.GitHubService).toSelf();
    container.bind(services_1.BitbucketService).toSelf();
    container.bind(GitLabService_1.GitLabService).toSelf();
    const scanningStrategyExplorer = container.get(ScanningStrategyExplorer_1.ScanningStrategyExplorer);
    const scanningStrategyDetector = container.get(detectors_1.ScanningStrategyDetector);
    const fileSystemService = container.get(services_1.FileSystemService);
    const fileInspector = container.get(types_1.Types.IFileInspector);
    const issueTrackingInspector = container.get(types_1.Types.IIssueTrackingInspector);
    const collaborationInspector = container.get(types_1.Types.ICollaborationInspector);
    console.log('getting fs service');
    const virtualFileSystemService = container.get(types_1.Types.IProjectFilesBrowser);
    const packageInspector = container.get(types_1.Types.IPackageInspector);
    /**
     * Practice context for testing purposes
     */
    const practiceContext = {
        projectComponent: projectComponent || {
            path: './',
            language: model_1.ProgrammingLanguage.JavaScript,
            type: model_1.ProjectComponentType.Application,
            platform: model_1.ProjectComponentPlatform.UNKNOWN,
            framework: model_1.ProjectComponentFramework.UNKNOWN,
        },
        packageInspector,
        gitInspector: undefined,
        issueTrackingInspector,
        collaborationInspector,
        fileInspector,
        root: { fileInspector },
    };
    const fixerContext = Object.assign(Object.assign({}, practiceContext), { fileService: virtualFileSystemService });
    return {
        container,
        practiceContext,
        fixerContext,
        scanningStrategyExplorer,
        fileSystemService,
        virtualFileSystemService,
        scanningStrategyDetector,
    };
};
//# sourceMappingURL=inversify.config.js.map