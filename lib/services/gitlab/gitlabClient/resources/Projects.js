"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projects = void 0;
const GitLabClient_1 = require("../GitLabClient");
const gitlabUtils_1 = require("../gitlabUtils");
class Projects extends GitLabClient_1.GitLabClient {
    constructor() {
        super(...arguments);
        this.api = this.createAxiosInstance();
    }
    async get(projectId) {
        const endpoint = `projects/${encodeURIComponent(projectId)}`;
        const response = await this.api.get(endpoint);
        return gitlabUtils_1.parseResponse(response);
    }
    async list() {
        const response = await this.api.get('projects');
        return gitlabUtils_1.parseResponse(response);
    }
}
exports.Projects = Projects;
//# sourceMappingURL=Projects.js.map