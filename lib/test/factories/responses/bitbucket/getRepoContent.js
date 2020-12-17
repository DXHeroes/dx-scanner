"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketRepoInfoResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.bitbucketRepoInfoResponseFactory = (params) => {
    return lodash_1.default.merge({
        scm: 'hg',
        website: 'http://pypy.org/',
        has_wiki: true,
        uuid: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
        links: {
            watchers: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/watchers',
            },
            branches: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/refs/branches',
            },
            tags: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/refs/tags',
            },
            commits: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/commits',
            },
            clone: [
                {
                    href: 'https://bitbucket.org/pypy/pypy',
                    name: 'https',
                },
                {
                    href: 'ssh://hg@bitbucket.org/pypy/pypy',
                    name: 'ssh',
                },
            ],
            self: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy',
            },
            source: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/src',
            },
            html: {
                href: 'https://bitbucket.org/pypy/pypy',
            },
            avatar: {
                href: 'https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930',
            },
            hooks: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/hooks',
            },
            forks: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/forks',
            },
            downloads: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/downloads',
            },
            issues: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues',
            },
            pullrequests: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests',
            },
        },
        fork_policy: 'allow_forks',
        name: 'pypy',
        project: {
            key: 'PROJ',
            type: 'project',
            uuid: '{9e6412d6-bace-4231-9af1-0d539782b369}',
            links: {
                self: {
                    href: 'https://api.bitbucket.org/2.0/teams/pypy/projects/PROJ',
                },
                html: {
                    href: 'https://bitbucket.org/account/user/pypy/projects/PROJ',
                },
                avatar: {
                    href: 'https://bitbucket.org/account/user/pypy/projects/PROJ/avatar/32?ts=1503082148',
                },
            },
            name: 'PyPy project',
        },
        language: 'python',
        created_on: '2010-12-13T13:05:45.880068+00:00',
        mainbranch: {
            type: 'named_branch',
            name: 'default',
        },
        full_name: 'pypy/pypy',
        has_issues: true,
        owner: {
            username: 'pypy',
            display_name: 'PyPy',
            type: 'team',
            uuid: '{f122f6a4-9111-4431-9f88-884d8cedd194}',
            links: {
                self: {
                    href: 'https://api.bitbucket.org/2.0/teams/%7Bf122f6a4-9111-4431-9f88-884d8cedd194%7D',
                },
                html: {
                    href: 'https://bitbucket.org/%7Bf122f6a4-9111-4431-9f88-884d8cedd194%7D/',
                },
                avatar: {
                    href: 'https://bitbucket.org/account/pypy/avatar/',
                },
            },
        },
        updated_on: '2020-03-16T18:28:32.141576+00:00',
        size: 827228752,
        type: 'repository',
        slug: 'pypy',
        is_private: false,
        description: '<<<< DEVELOPMENT OF PYPY HAS MOVED TO https://foss.heptapod.net/pypy/pypy >>>>',
    }, params);
};
//# sourceMappingURL=getRepoContent.js.map