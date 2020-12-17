"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLabClient = void 0;
const axios_1 = __importDefault(require("axios"));
const inversify_1 = require("inversify");
const debug_1 = __importDefault(require("debug"));
const https_1 = __importDefault(require("https"));
let GitLabClient = class GitLabClient {
    constructor({ token, host = 'https://gitlab.com', timeout = 5000 }) {
        this.headers = {};
        this.host = host;
        this.timeout = timeout;
        if (token)
            this.headers['Authorization'] = `Bearer ${token}`;
    }
    createAxiosInstance() {
        debug_1.default('GitlabClient')(this.host);
        debug_1.default('GitlabClient')(this.timeout);
        return axios_1.default.create({
            baseURL: `${this.host}/api/v4`,
            timeout: this.timeout,
            headers: Object.assign({}, this.headers),
            httpsAgent: new https_1.default.Agent({
                rejectUnauthorized: false,
            }),
        });
    }
};
GitLabClient = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Object])
], GitLabClient);
exports.GitLabClient = GitLabClient;
//# sourceMappingURL=GitLabClient.js.map