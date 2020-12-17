"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindDiscoveryContext = void 0;
const detectors_1 = require("../../detectors");
const services_1 = require("../../services");
const GitLabService_1 = require("../../services/gitlab/GitLabService");
const types_1 = require("../../types");
const scannerContextBinding_1 = require("../scanner/scannerContextBinding");
const DiscoveryContext_1 = require("./DiscoveryContext");
exports.bindDiscoveryContext = (container) => {
    container.bind(types_1.Types.DiscoveryContextFactory).toFactory(() => {
        return (repositoryConfig) => {
            const discoveryContextContainer = createDiscoveryContainer(repositoryConfig, container);
            return discoveryContextContainer.get(DiscoveryContext_1.DiscoveryContext);
        };
    });
};
const createDiscoveryContainer = (repositoryConfig, rootContainer) => {
    const container = rootContainer.createChild();
    container.bind(types_1.Types.RepositoryConfig).toConstantValue(repositoryConfig);
    container.bind(detectors_1.ScanningStrategyDetector).toSelf();
    container.bind(services_1.GitHubService).toSelf();
    container.bind(services_1.BitbucketService).toSelf();
    container.bind(GitLabService_1.GitLabService).toSelf();
    container.bind(DiscoveryContext_1.DiscoveryContext).toSelf();
    scannerContextBinding_1.bindScanningContext(container);
    return container;
};
//# sourceMappingURL=discoveryContextBinding.js.map