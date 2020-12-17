"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindProjectComponentContext = void 0;
const types_1 = require("../../types");
const ConfigProvider_1 = require("../../scanner/ConfigProvider");
const ProjectComponentContext_1 = require("./ProjectComponentContext");
exports.bindProjectComponentContext = (container) => {
    container.bind(types_1.Types.ProjectComponentContextFactory).toFactory((ctx) => {
        return (projectComponent) => {
            const projectComponentContextContainer = createProjectComponentContainer(projectComponent, ctx.container);
            return projectComponentContextContainer.get(ProjectComponentContext_1.ProjectComponentContext);
        };
    });
};
const createProjectComponentContainer = (projectComponent, rootContainer) => {
    const container = rootContainer.createChild();
    container.bind(types_1.Types.ConfigProvider).to(ConfigProvider_1.ConfigProvider);
    container.bind(types_1.Types.ProjectComponent).toConstantValue(projectComponent);
    container.bind(types_1.Types.PracticeContextFactory).toFactory((ctx) => {
        return (projectComponent) => {
            let gitInspector;
            try {
                gitInspector = ctx.container.get(types_1.Types.IGitInspector);
            }
            catch (_a) { }
            return {
                projectComponent: projectComponent,
                packageInspector: ctx.container.get(types_1.Types.IPackageInspector),
                gitInspector,
                issueTrackingInspector: projectComponent.repositoryPath ? ctx.container.get(types_1.Types.IIssueTrackingInspector) : undefined,
                collaborationInspector: projectComponent.repositoryPath ? ctx.container.get(types_1.Types.ICollaborationInspector) : undefined,
                fileInspector: ctx.container.get(types_1.Types.IFileInspector),
                root: {
                    fileInspector: ctx.container.get(types_1.Types.IRootFileInspector),
                },
            };
        };
    });
    container.bind(ProjectComponentContext_1.ProjectComponentContext).toSelf();
    return container;
};
//# sourceMappingURL=projectComponentContextBinding.js.map