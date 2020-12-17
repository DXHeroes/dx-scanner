"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitbucketIssueCommentResponseFactory = void 0;
const lodash_1 = __importDefault(require("lodash"));
exports.bitbucketIssueCommentResponseFactory = (params) => {
    return lodash_1.default.merge({
        links: {
            self: {
                href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086/comments/54230712',
            },
            html: {
                href: 'https://bitbucket.org/pypy/pypy/issues/3086#comment-54230712',
            },
        },
        issue: {
            links: {
                self: {
                    href: 'https://api.bitbucket.org/2.0/repositories/pypy/pypy/issues/3086',
                },
            },
            type: 'issue',
            id: 3086,
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
            title: 'arm64 JIT: Lots of crashes',
        },
        content: {
            raw: undefined,
            markup: 'markdown',
            html: '',
        },
        created_on: '2019-10-07T06:12:23.627201+00:00',
        user: {
            display_name: 'Stefano Rivera',
            uuid: '{dfa073eb-c602-4740-83ef-a8fe8ee03dfd}',
            links: {
                self: {
                    href: 'https://api.bitbucket.org/2.0/users/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D',
                },
                html: {
                    href: 'https://bitbucket.org/%7Bdfa073eb-c602-4740-83ef-a8fe8ee03dfd%7D/',
                },
                avatar: {
                    href: 'https://secure.gravatar.com/avatar/0b25ad2bcea703792d5a7bfc521a47ca?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSR-5.png',
                },
            },
            nickname: 'stefanor',
            type: 'user',
            account_id: '557058:efb9f360-846e-4950-afaa-c6a5da7e77b2',
        },
        updated_on: undefined,
        type: 'issue_comment',
        id: 54230712,
    }, params);
};
//# sourceMappingURL=issueCommentResponseFactory.js.map