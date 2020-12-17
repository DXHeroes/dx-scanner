"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeRequests = void 0;
const qs_1 = __importDefault(require("qs"));
const GitLabClient_1 = require("../GitLabClient");
const gitlabUtils_1 = require("../gitlabUtils");
class MergeRequests extends GitLabClient_1.GitLabClient {
    constructor() {
        super(...arguments);
        this.api = this.createAxiosInstance();
    }
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param options
     *
     * List all merge requests for project.
     */
    async list(projectId, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests`;
        const params = {};
        if ((_a = options === null || options === void 0 ? void 0 : options.filter) === null || _a === void 0 ? void 0 : _a.state)
            params.state = (_b = options === null || options === void 0 ? void 0 : options.filter) === null || _b === void 0 ? void 0 : _b.state;
        if ((_c = options === null || options === void 0 ? void 0 : options.filter) === null || _c === void 0 ? void 0 : _c.sourceBranch)
            params.source_branch = (_d = options === null || options === void 0 ? void 0 : options.filter) === null || _d === void 0 ? void 0 : _d.sourceBranch;
        if ((_e = options === null || options === void 0 ? void 0 : options.pagination) === null || _e === void 0 ? void 0 : _e.page)
            params.page = (_f = options === null || options === void 0 ? void 0 : options.pagination) === null || _f === void 0 ? void 0 : _f.page;
        if ((_g = options === null || options === void 0 ? void 0 : options.pagination) === null || _g === void 0 ? void 0 : _g.perPage)
            params.per_page = (_h = options === null || options === void 0 ? void 0 : options.pagination) === null || _h === void 0 ? void 0 : _h.perPage;
        const response = await this.api.get(endpoint, {
            params,
            paramsSerializer: (params) => {
                return qs_1.default.stringify(params, { arrayFormat: 'repeat', encode: false });
            },
        });
        return gitlabUtils_1.parseResponse(response);
    }
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param options
     *
     * Get single pull request (merge request) of given merge_request_iid
     */
    async get(projectId, mergeRequestIId) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}`;
        const response = await this.api.get(endpoint);
        return gitlabUtils_1.parseResponse(response);
    }
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param options
     *
     * List all commits for merge request of given iid
     */
    async listCommits(projectId, mergeRequestIId, pagination) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/commits`;
        const params = {
            page: pagination === null || pagination === void 0 ? void 0 : pagination.page,
            per_page: pagination === null || pagination === void 0 ? void 0 : pagination.perPage,
        };
        const response = await this.api.get(endpoint, { params });
        return gitlabUtils_1.parseResponse(response);
    }
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param pagination
     *
     * Gets a list of all notes for a single merge request.
     */
    async listComments(projectId, mergeRequestIId, pagination) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes`;
        const params = {
            page: pagination === null || pagination === void 0 ? void 0 : pagination.page,
            per_page: pagination === null || pagination === void 0 ? void 0 : pagination.perPage,
        };
        const response = await this.api.get(endpoint, { params });
        return gitlabUtils_1.parseResponse(response);
    }
    /**
     *
     * @param projectId - The ID or URL path of the project, e.g. DXHeroes/dx-scanner
     * @param mergeRequestIId
     * @param body
     *
     * Creates a new note for a single merge request.
     * If you create a note where the body only contains an Award Emoji, you’ll receive this object back.
     */
    async createComment(projectId, mergeRequestIId, body) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes`;
        const response = await this.api.post(endpoint, { body });
        return gitlabUtils_1.parseResponse(response);
    }
    /**
     *
     * @param projectId
     * @param mergeRequestIId
     * @param body
     * @param commentId
     *
     * Modify existing note of a merge request
     */
    async updateComment(projectId, mergeRequestIId, body, commentId) {
        const endpoint = `projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIId}/notes/${commentId}`;
        const response = await this.api.put(endpoint, { body });
        return gitlabUtils_1.parseResponse(response);
    }
}
exports.MergeRequests = MergeRequests;
//# sourceMappingURL=MergeRequests.js.map