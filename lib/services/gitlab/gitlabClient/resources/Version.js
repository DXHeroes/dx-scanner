"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
const GitLabClient_1 = require("../GitLabClient");
const gitlabUtils_1 = require("../gitlabUtils");
class Version extends GitLabClient_1.GitLabClient {
    constructor() {
        super(...arguments);
        this.api = this.createAxiosInstance();
    }
    async check() {
        const endpoint = 'version';
        const response = await this.api.get(endpoint);
        return gitlabUtils_1.parseResponse(response);
    }
}
exports.Version = Version;
//# sourceMappingURL=Version.js.map