"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketPullRequestResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
const IBitbucketService_1 = require("../../../../services/bitbucket/IBitbucketService");
exports.bitbucketPullRequestResponseFactory = (params) => {
    return lodash_1.default.merge({
        description: 'Added a floor() ufunc to micronumpy',
        links: {
            decline: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/decline',
            },
            commits: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/commits',
            },
            self: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1',
            },
            comments: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/comments',
            },
            merge: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/merge',
            },
            html: {
                href: 'https://bitbucket.org/pypy/pypy/pull-requests/1',
            },
            activity: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/activity',
            },
            diff: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/None?from_pullrequest_id=1',
            },
            approve: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/1/approve',
            },
        },
        title: 'floor ufunc for micronumpy',
        close_source_branch: false,
        reviewers: [],
        id: 1,
        destination: {
            commit: undefined,
            repository: {
                links: {
                    self: {
                        href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy',
                    },
                    html: {
                        href: 'https://bitbucket.org/pypy/pypy',
                    },
                    avatar: {
                        href: 'https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930',
                    },
                },
                type: 'repository',
                name: 'pypy',
                full_name: 'pypy/pypy',
                uuid: '{54220cd1-b139-4188-9455-1e13e663f1ac}',
            },
            branch: {
                name: 'default',
            },
        },
        created_on: '2011-06-22T19:44:39.555192+00:00',
        summary: {
            raw: 'Added a floor() ufunc to micronumpy',
            markup: 'markdown',
            html: '<p>Added a floor() ufunc to micronumpy</p>',
        },
        source: {
            commit: {
                hash: '0f45e3d5961f',
            },
            repository: {
                links: {
                    self: {
                        href: 'https://api.bitbucket.org/2.0/repositories/landtuna/pypy',
                    },
                    html: {
                        href: 'https://bitbucket.org/landtuna/pypy',
                    },
                    avatar: {
                        href: 'https://bytebucket.org/ravatar/%7Ba4ea93c2-1b22-45dd-9e1e-66da399dc087%7D?ts=default',
                    },
                },
                type: 'repository',
                name: 'pypy',
                full_name: 'landtuna/pypy',
                uuid: '{a4ea93c2-1b22-45dd-9e1e-66da399dc087}',
            },
            branch: {
                name: '',
            },
        },
        comment_count: 0,
        state: IBitbucketService_1.BitbucketPullRequestState.open,
        task_count: 0,
        participants: [],
        reason: 'already merged',
        updated_on: '2011-06-23T13:52:30.230741+00:00',
        author: {
            display_name: 'Jim Hunziker',
            uuid: '{9d65d517-4898-47ac-9d2f-fd902d25d9f6}',
            links: {
                self: {
                    href: 'https://api.bitbucket.org/2.0/users/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D',
                },
                html: {
                    href: 'https://bitbucket.org/%7B9d65d517-4898-47ac-9d2f-fd902d25d9f6%7D/',
                },
                avatar: {
                    href: 'https://bitbucket.org/account/landtuna/avatar/',
                },
            },
            nickname: 'landtuna',
            type: 'user',
            account_id: null,
        },
        merge_commit: undefined,
        closed_by: {
            display_name: 'Maciej Fijalkowski',
            uuid: '{99b67766-d1ba-42c6-a80e-543f7318428b}',
            links: {
                self: {
                    href: 'https://api.bitbucket.org/2.0/users/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D',
                },
                html: {
                    href: 'https://bitbucket.org/%7B99b67766-d1ba-42c6-a80e-543f7318428b%7D/',
                },
                avatar: {
                    href: 'https://secure.gravatar.com/avatar/bfc96d2a02d9113edb992eb96c205c5a?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMF-0.png',
                },
            },
            nickname: 'fijal',
            type: 'user',
            account_id: '557058:4805a215-8388-4152-9c83-043e10a4435a',
        },
        type: 'rendered',
        page: 1,
        next: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests?page=2',
    }, params);
};
//# sourceMappingURL=prResponseFactory.js.map