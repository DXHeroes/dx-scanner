"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIReporterUtils = void 0;
/* eslint-disable no-process-env */
const lodash_1 = __importDefault(require("lodash"));
const services_1 = require("../services");
const errors_1 = require("../lib/errors");
const assertNever_1 = require("../lib/assertNever");
class CIReporterUtils {
    static loadConfigurationTravis() {
        const ev = process.env;
        if (!ev.TRAVIS_REPO_SLUG)
            throw errors_1.ErrorFactory.newInternalError('Could not load Travis configuration');
        const repoOwnerAndName = ev.TRAVIS_REPO_SLUG.split('/');
        return {
            service: services_1.VCSServiceType.github,
            pullRequestId: ev.TRAVIS_PULL_REQUEST !== 'false' ? Number(ev.TRAVIS_PULL_REQUEST) : undefined,
            repository: {
                owner: repoOwnerAndName[0],
                name: repoOwnerAndName[1],
            },
        };
    }
    static loadConfigurationGitHubActions() {
        const ev = process.env;
        if (!ev.GITHUB_REPOSITORY || !ev.GITHUB_REF)
            throw errors_1.ErrorFactory.newInternalError('Could not load GitHub Actions configuration');
        const repoOwnerAndName = ev.GITHUB_REPOSITORY.split('/');
        const pullRequestId = lodash_1.default.includes(ev.GITHUB_REF, 'refs/pull') ? ev.GITHUB_REF.split('/')[2] : undefined;
        return {
            service: services_1.VCSServiceType.github,
            pullRequestId: Number(pullRequestId),
            repository: {
                owner: repoOwnerAndName[0],
                name: repoOwnerAndName[1],
            },
        };
    }
    static loadConfigurationBitbucket() {
        const ev = process.env;
        return {
            service: services_1.VCSServiceType.bitbucket,
            pullRequestId: Number(ev.BITBUCKET_PR_ID),
            repository: {
                owner: ev.BITBUCKET_REPO_OWNER,
                name: ev.BITBUCKET_REPO_SLUG,
            },
        };
    }
    static loadConfigurationAppveyor() {
        const ev = process.env;
        if (!ev.APPVEYOR_REPO_NAME)
            throw errors_1.ErrorFactory.newInternalError('Could not load Appveyor configuration');
        const repoOwnerAndName = ev.APPVEYOR_REPO_NAME.split('/');
        let service;
        const appveyorProvider = ev.APPVEYOR_REPO_PROVIDER;
        switch (appveyorProvider) {
            case AppveyorProvider.github:
                service = services_1.VCSServiceType.github;
                break;
            case AppveyorProvider.bitBucket:
                service = services_1.VCSServiceType.bitbucket;
                break;
            case AppveyorProvider.kiln:
            case AppveyorProvider.vso:
            case AppveyorProvider.gitLab:
            case AppveyorProvider.gitHubEnterprise:
            case AppveyorProvider.gitLabEnterprise:
            case AppveyorProvider.stash:
            case AppveyorProvider.gitea:
            case AppveyorProvider.git:
            case AppveyorProvider.mercurial:
            case AppveyorProvider.subversion:
                throw errors_1.ErrorFactory.newInternalError(`We don't support "${appveyorProvider}" yet`);
            default:
                assertNever_1.assertNever(appveyorProvider);
        }
        return {
            service: service,
            pullRequestId: Number(ev.APPVEYOR_PULL_REQUEST_NUMBER),
            repository: {
                owner: repoOwnerAndName[0],
                name: repoOwnerAndName[1],
            },
        };
    }
}
exports.CIReporterUtils = CIReporterUtils;
var AppveyorProvider;
(function (AppveyorProvider) {
    AppveyorProvider["github"] = "gitHub";
    AppveyorProvider["bitBucket"] = "bitBucket";
    AppveyorProvider["kiln"] = "kiln";
    AppveyorProvider["vso"] = "vso";
    AppveyorProvider["gitLab"] = "gitLab";
    AppveyorProvider["gitHubEnterprise"] = "gitHubEnterprise";
    AppveyorProvider["gitLabEnterprise"] = "gitLabEnterprise";
    AppveyorProvider["stash"] = "stash";
    AppveyorProvider["gitea"] = "gitea";
    AppveyorProvider["git"] = "git";
    AppveyorProvider["mercurial"] = "mercurial";
    AppveyorProvider["subversion"] = "subversion";
})(AppveyorProvider || (AppveyorProvider = {}));
//# sourceMappingURL=CIReporterUtils.js.map