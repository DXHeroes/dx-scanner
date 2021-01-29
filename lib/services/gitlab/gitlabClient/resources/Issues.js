"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Issues = void 0;
const GitLabClient_1 = require("../GitLabClient");
const gitlabUtils_1 = require("../gitlabUtils");
const qs_1 = __importDefault(require("qs"));
class Issues extends GitLabClient_1.GitLabClient {
    constructor() {
        super(...arguments);
        this.api = this.createAxiosInstance();
    }
    async list(projectId, options) {
        var _a, _b, _c;
        const endpoint = `projects/${encodeURIComponent(projectId)}/issues`;
        const params = {
            page: (_a = options === null || options === void 0 ? void 0 : options.pagination) === null || _a === void 0 ? void 0 : _a.page,
            per_page: (_b = options === null || options === void 0 ? void 0 : options.pagination) === null || _b === void 0 ? void 0 : _b.perPage,
            state: (_c = options === null || options === void 0 ? void 0 : options.filter) === null || _c === void 0 ? void 0 : _c.state,
        };
        const response = await this.api.get(endpoint, {
            params,
            paramsSerializer: (params) => {
                return qs_1.default.stringify(params, { arrayFormat: 'repeat', encode: false });
            },
        });
        return gitlabUtils_1.parseResponse(response);
    }
    async get(projectId, issueIId) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/issues/${issueIId}`;
        const response = await this.api.get(endpoint);
        return gitlabUtils_1.parseResponse(response);
    }
    async listComments(projectId, issueIId, pagination) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/issues/${issueIId}/notes`;
        const params = {
            page: pagination === null || pagination === void 0 ? void 0 : pagination.page,
            per_page: pagination === null || pagination === void 0 ? void 0 : pagination.perPage,
        };
        const response = await this.api.get(endpoint, { params });
        return gitlabUtils_1.parseResponse(response);
    }
}
exports.Issues = Issues;
//# sourceMappingURL=Issues.js.map