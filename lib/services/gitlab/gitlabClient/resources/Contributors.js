"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contributors = void 0;
const GitLabClient_1 = require("../GitLabClient");
const gitlabUtils_1 = require("../gitlabUtils");
class Contributors extends GitLabClient_1.GitLabClient {
    constructor() {
        super(...arguments);
        this.api = this.createAxiosInstance();
    }
    async list(projectId, pagination) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/repository/contributors`;
        const params = {
            page: pagination === null || pagination === void 0 ? void 0 : pagination.page,
            per_page: pagination === null || pagination === void 0 ? void 0 : pagination.perPage,
        };
        const response = await this.api.get(endpoint, { params });
        return gitlabUtils_1.parseResponse(response);
    }
}
exports.Contributors = Contributors;
//# sourceMappingURL=Contributors.js.map