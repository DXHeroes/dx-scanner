"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const GitLabClient_1 = require("../GitLabClient");
const gitlabUtils_1 = require("../gitlabUtils");
class Users extends GitLabClient_1.GitLabClient {
    constructor() {
        super(...arguments);
        this.api = this.createAxiosInstance();
    }
    async searchUsersByEmail(email) {
        const endpoint = `users`;
        const params = { search: email };
        const response = await this.api.get(endpoint, { params });
        return gitlabUtils_1.parseResponse(response);
    }
    async searchUsersByName(name) {
        const endpoint = `users`;
        const params = { search: name };
        const response = await this.api.get(endpoint, { params });
        return gitlabUtils_1.parseResponse(response);
    }
    async getUser(userName) {
        const endpoint = `users`;
        const params = { username: userName };
        const response = await this.api.get(endpoint, { params });
        return gitlabUtils_1.parseResponse(response);
    }
    async getGroup(groupName) {
        const endpoint = `groups/${encodeURIComponent(groupName)}`;
        // Increase timeout as the request for group info takes longer than the other requests
        const response = await this.api.get(endpoint, { timeout: 15000 });
        return gitlabUtils_1.parseResponse(response);
    }
    async listGroups() {
        const response = await this.api.get('groups');
        return gitlabUtils_1.parseResponse(response);
    }
}
exports.Users = Users;
//# sourceMappingURL=UsersOrGroups.js.map