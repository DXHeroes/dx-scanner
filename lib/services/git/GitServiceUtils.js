"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitServiceUtils = void 0;
const git_url_parse_1 = __importDefault(require("git-url-parse"));
const lodash_1 = __importStar(require("lodash"));
const path_1 = __importDefault(require("path"));
const IScanningStrategy_1 = require("../../detectors/IScanningStrategy");
const assertNever_1 = require("../../lib/assertNever");
class GitServiceUtils {
}
exports.GitServiceUtils = GitServiceUtils;
GitServiceUtils.getUrlToRepo = (url, scanningStrategy, path, branch = 'master') => {
    const parsedUrl = git_url_parse_1.default(url);
    let completeUrl = `https://${parsedUrl.resource}/${parsedUrl.owner}/${parsedUrl.name}`;
    if (path) {
        const relPath = lodash_1.replace(path, scanningStrategy.rootPath || '', '');
        completeUrl += GitServiceUtils.getPath(relPath, branch || parsedUrl.ref, scanningStrategy.serviceType);
    }
    return completeUrl;
};
GitServiceUtils.parseUrl = (url) => {
    const parsedUrl = git_url_parse_1.default(url);
    return {
        owner: parsedUrl.owner,
        repoName: parsedUrl.name,
        host: parsedUrl.resource,
        protocol: parsedUrl.protocol,
    };
};
GitServiceUtils.getPath = (componentPath, branch = 'master', serviceType) => {
    if (!componentPath || componentPath === '') {
        return '';
    }
    const resPath = () => {
        switch (serviceType) {
            case IScanningStrategy_1.ServiceType.github:
                return `/tree/${branch}/${componentPath}`;
            case IScanningStrategy_1.ServiceType.bitbucket:
                return `/src/${branch}/${componentPath}`;
            case IScanningStrategy_1.ServiceType.gitlab:
                return `/tree/${branch}/${componentPath}`;
            case IScanningStrategy_1.ServiceType.local:
                return componentPath;
            case IScanningStrategy_1.ServiceType.git:
                return `${branch}/${componentPath}`;
            default:
                return assertNever_1.assertNever(serviceType);
        }
    };
    return path_1.default.normalize(resPath());
};
GitServiceUtils.getRepoName = (repositoryPath, path) => {
    if (repositoryPath) {
        const parsedUrl = git_url_parse_1.default(repositoryPath);
        return `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.owner}/${parsedUrl.name}`;
    }
    else {
        return path;
    }
};
GitServiceUtils.getPathOrRepoUrl = (url, scanningStrategy, path, branch = 'master') => {
    const parsedUrl = git_url_parse_1.default(url);
    if (parsedUrl.protocol === 'file') {
        return url;
    }
    return GitServiceUtils.getUrlToRepo(url, scanningStrategy, path, branch);
};
GitServiceUtils.getComponentPath = (component, scanningStrategy) => {
    let componentPath, urlComponentPath, repoPath;
    if (scanningStrategy.isOnline) {
        // get component path without tmp folder path
        componentPath = lodash_1.default.replace(component.path, scanningStrategy.localPath, '');
        // if it's root component, return repo path directly
        const parsedUrl = git_url_parse_1.default(component.repositoryPath);
        repoPath = `${parsedUrl.protocol}://${parsedUrl.resource}/${parsedUrl.full_name}`;
        if (!componentPath) {
            return repoPath;
        }
        // get path to component according to service type
        urlComponentPath = GitServiceUtils.getPath(componentPath || component.path, 'master', scanningStrategy.serviceType);
    }
    repoPath = repoPath || component.repositoryPath;
    // if scanner is running remotely, concat repo path with component path, if not return local path directly
    return urlComponentPath ? (repoPath += urlComponentPath) : component.path;
};
GitServiceUtils.getComponentLocalPath = (component, scanningStrategy) => {
    const cwp = lodash_1.default.replace(component.path, scanningStrategy.localPath, '');
    return path_1.default.basename(cwp);
};
//# sourceMappingURL=GitServiceUtils.js.map