//import { BitbucketNock } from "../../../test/helpers/bibucketNock";
import { BitbucketService } from "./BitbucketService";

/* eslint-disable @typescript-eslint/camelcase */
// import { GitHubService } from './GitHubService';
// import { getPullsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsServiceResponse.mock';
// import { getPullsReviewsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsReviewsServiceResponse.mock';
// import { getCommitServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getCommitServiceResponse.mock';
// import { getContributorsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsServiceResponse.mock';
// import { getContributorsStatsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsStatsServiceResponse.mock';
// import {
//   getRepoContentServiceResponseDir,
//   getRepoContentServiceResponseFile,
// } from './__MOCKS__/gitHubServiceMockFolder/getRepoContentServiceResponse.mock';
// import { getIssuesServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssuesServiceResponse.mock';
// import { getPullRequestsReviewsResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullRequestsReviewsResponse.mock';
// import { getCommitResponse } from './__MOCKS__/gitHubServiceMockFolder/getCommitResponse.mock';
// import { getContributorsStatsResponse } from './__MOCKS__/gitHubServiceMockFolder/getContributorsStatsResponse.mock';
// import { getIssuesResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssuesResponse.mock';
// import { getIssueCommentsResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssueCommentsResponse.mock';
// import { getIssueCommentsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getIssueCommentsServiceResponse.mock';
import nock from 'nock';
import { BitbucketNock } from "../../../test/helpers/bibucketNock";
// import { getPullsFilesResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsFiles.mock';
// import { getPullsFilesServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullFilesServiceResponse.mock';
// import { getPullCommitsResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullsCommitsResponse.mock';
// import { getPullCommitsServiceResponse } from './__MOCKS__/gitHubServiceMockFolder/getPullCommitsServiceResponse.mock';
// import { BitbucketNock } from '../../../test/helpers/BitbucketNock';
// import { GitHubPullRequestState } from './IGitHubService';
// import { getRepoCommitsResponse } from './__MOCKS__/gitHubServiceMockFolder/getRepoCommitsResponse.mock';
// import { File } from './model';

describe('GitHub Service', () => {
    let service: BitbucketService;

    beforeEach(async () => {
        service = new BitbucketService({ uri: '.' });
        nock.cleanAll();
    });

    describe('#getPullRequests', () => {
        it('', async () => {
            const reply = {
                "pagelen": 10,
                "size": 18,
                "values": [
                    {
                        "description": "Encountered lots of problems in an old C extension I was trying to get working with PyPy, to do with missing things inside datetime.h \\(and cpyext\\_datetime.h\\).\r\n\r\nIdea is to bring everything a bit closer to: [https://github.com/python/cpython/blob/master/Include/datetime.h](https://github.com/python/cpython/blob/master/Include/datetime.h)\r\n\r\nIncluded in this is 'long hashcode' in:  \r\n\tPyDateTime\\_Delta  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime  \r\n\tPyDateTime\\_Date\r\n\r\nAlso added 'unsigned char fold' \\(\\+ new constructors that let this be used\\) to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime\r\n\r\nAnd: 'unsigned char data\\[...\\]' to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_Date  \r\n\tPyDateTime\\_DateTime\r\n\r\nFinally, added the objects:  \r\n\t\\_PyDateTime\\_BaseTime  \r\n\t\\_PyDateTime\\_BaseDateTime\r\n\r\nAlso brought across DATETIME\\_API\\_MAGIC which is a part of CPython and I found I had a reliance on \\(therefore others might have the same thing\\)",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/ashwinahuja/pypy:f79995148331%0D5fa60afb5e51?from_pullrequest_id=622"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/622"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/ashwinahuja/pypy:f79995148331%0D5fa60afb5e51?from_pullrequest_id=622"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/622/statuses"
                            }
                        },
                        "title": "Make more compatible with old C extensions using the PyDateTime_... objects",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 622,
                        "destination": {
                            "commit": {
                                "hash": "5fa60afb5e51",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "created_on": "2018-09-13T16:43:59.014478+00:00",
                        "summary": {
                            "raw": "Encountered lots of problems in an old C extension I was trying to get working with PyPy, to do with missing things inside datetime.h \\(and cpyext\\_datetime.h\\).\r\n\r\nIdea is to bring everything a bit closer to: [https://github.com/python/cpython/blob/master/Include/datetime.h](https://github.com/python/cpython/blob/master/Include/datetime.h)\r\n\r\nIncluded in this is 'long hashcode' in:  \r\n\tPyDateTime\\_Delta  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime  \r\n\tPyDateTime\\_Date\r\n\r\nAlso added 'unsigned char fold' \\(\\+ new constructors that let this be used\\) to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_DateTime\r\n\r\nAnd: 'unsigned char data\\[...\\]' to:  \r\n\tPyDateTime\\_Time  \r\n\tPyDateTime\\_Date  \r\n\tPyDateTime\\_DateTime\r\n\r\nFinally, added the objects:  \r\n\t\\_PyDateTime\\_BaseTime  \r\n\t\\_PyDateTime\\_BaseDateTime\r\n\r\nAlso brought across DATETIME\\_API\\_MAGIC which is a part of CPython and I found I had a reliance on \\(therefore others might have the same thing\\)",
                            "markup": "markdown",
                            "html": "<p>Encountered lots of problems in an old C extension I was trying to get working with PyPy, to do with missing things inside datetime.h (and cpyext_datetime.h).</p>\n<p>Idea is to bring everything a bit closer to: <a data-is-external-link=\"true\" href=\"https://github.com/python/cpython/blob/master/Include/datetime.h\" rel=\"nofollow\">https://github.com/python/cpython/blob/master/Include/datetime.h</a></p>\n<p>Included in this is 'long hashcode' in:<br />\n    PyDateTime_Delta<br />\n    PyDateTime_Time<br />\n    PyDateTime_DateTime<br />\n    PyDateTime_Date</p>\n<p>Also added 'unsigned char fold' (+ new constructors that let this be used) to:<br />\n    PyDateTime_Time<br />\n    PyDateTime_DateTime</p>\n<p>And: 'unsigned char data[...]' to:<br />\n    PyDateTime_Time<br />\n    PyDateTime_Date<br />\n    PyDateTime_DateTime</p>\n<p>Finally, added the objects:<br />\n    _PyDateTime_BaseTime<br />\n    _PyDateTime_BaseDateTime</p>\n<p>Also brought across DATETIME_API_MAGIC which is a part of CPython and I found I had a reliance on (therefore others might have the same thing)</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "f79995148331",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy/commit/f79995148331"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/ashwinahuja/pypy/commits/f79995148331"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/ashwinahuja/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/ashwinahuja/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7Bed2b5d25-be07-4808-b0dd-c5d4633e4a57%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "ashwinahuja/pypy",
                                "uuid": "{ed2b5d25-be07-4808-b0dd-c5d4633e4a57}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "comment_count": 3,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-09-22T07:28:06.932156+00:00",
                        "author": {
                            "display_name": "Ashwin Ahuja",
                            "uuid": "{f1f005b4-8963-4824-a447-3cdaebfd80a0}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7Bf1f005b4-8963-4824-a447-3cdaebfd80a0%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7Bf1f005b4-8963-4824-a447-3cdaebfd80a0%7D/"
                                },
                                "avatar": {
                                    "href": "https://secure.gravatar.com/avatar/b2161a145da2091ef7d2d874f2a25c37?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAA-2.png"
                                }
                            },
                            "nickname": "ashwinahuja",
                            "type": "user",
                            "account_id": "557058:30c16884-172c-4aed-8bcd-52d8b81dd0af"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "This pull request added a new PyPy related paper into the project’s documentation.   \r\nThe paper studied the performance impact of PyPy’s JIT compiler’s configuration and proposed a framework to tuning the JIT configuration based on the systems running on the top. More details of the paper can be found at: [https://link.springer.com/article/10.1007/s10664-019-09691-z](https://link.springer.com/article/10.1007/s10664-019-09691-z)",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/YangguangLi/pypy:e1e5b4863c5e%0D5fa60afb5e51?from_pullrequest_id=640"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/640"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/YangguangLi/pypy:e1e5b4863c5e%0D5fa60afb5e51?from_pullrequest_id=640"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/640/statuses"
                            }
                        },
                        "title": "Add a new PyPy related paper",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 640,
                        "destination": {
                            "commit": {
                                "hash": "5fa60afb5e51",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "created_on": "2019-04-08T02:04:02.177559+00:00",
                        "summary": {
                            "raw": "This pull request added a new PyPy related paper into the project’s documentation.   \r\nThe paper studied the performance impact of PyPy’s JIT compiler’s configuration and proposed a framework to tuning the JIT configuration based on the systems running on the top. More details of the paper can be found at: [https://link.springer.com/article/10.1007/s10664-019-09691-z](https://link.springer.com/article/10.1007/s10664-019-09691-z)",
                            "markup": "markdown",
                            "html": "<p>This pull request added a new PyPy related paper into the project’s documentation. <br />\nThe paper studied the performance impact of PyPy’s JIT compiler’s configuration and proposed a framework to tuning the JIT configuration based on the systems running on the top. More details of the paper can be found at: <a data-is-external-link=\"true\" href=\"https://link.springer.com/article/10.1007/s10664-019-09691-z\" rel=\"nofollow\">https://link.springer.com/article/10.1007/s10664-019-09691-z</a></p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "e1e5b4863c5e",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/YangguangLi/pypy/commit/e1e5b4863c5e"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/YangguangLi/pypy/commits/e1e5b4863c5e"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/YangguangLi/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/YangguangLi/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7Bbeb4d917-6df5-4ce9-9517-b55a47808ce1%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "YangguangLi/pypy",
                                "uuid": "{beb4d917-6df5-4ce9-9517-b55a47808ce1}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "comment_count": 3,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-09-22T07:28:06.610800+00:00",
                        "author": {
                            "display_name": "Yangguang Li",
                            "uuid": "{1473a74f-4cf5-4231-9a3a-22606db512b4}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B1473a74f-4cf5-4231-9a3a-22606db512b4%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B1473a74f-4cf5-4231-9a3a-22606db512b4%7D/"
                                },
                                "avatar": {
                                    "href": "https://secure.gravatar.com/avatar/3fb73d0e1ad433537b18842eefc7a8cd?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FYL-0.png"
                                }
                            },
                            "nickname": "YangguangLi",
                            "type": "user",
                            "account_id": "557058:439ad34a-3e0c-420e-8d4b-ef84f8a2782e"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "This allows PyPy to be codesigned with Hardened Runtime on macOS Mojave with `com.apple.security.cs.allow-jit` instead of `com.apple.security.cs.allow-unsigned-executable-memory` by mapping executable pages using the MAP\\_JIT flag to mmap. I’ve confirmed this flag exists at least back to 10.11 \\(El Capitan\\). I don’t know exactly how these defines get codegen'd so I’m not sure if I handled the linux/windows compilation case correctly.",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/lunixbochs/pypy:72a38eb8e613%0D5fa60afb5e51?from_pullrequest_id=635"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/635"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/lunixbochs/pypy:72a38eb8e613%0D5fa60afb5e51?from_pullrequest_id=635"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/635/statuses"
                            }
                        },
                        "title": "add mmap() MAP_JIT flag on Darwin for macOS Hardened Runtime",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 635,
                        "destination": {
                            "commit": {
                                "hash": "5fa60afb5e51",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "created_on": "2019-02-07T20:36:04.588199+00:00",
                        "summary": {
                            "raw": "This allows PyPy to be codesigned with Hardened Runtime on macOS Mojave with `com.apple.security.cs.allow-jit` instead of `com.apple.security.cs.allow-unsigned-executable-memory` by mapping executable pages using the MAP\\_JIT flag to mmap. I’ve confirmed this flag exists at least back to 10.11 \\(El Capitan\\). I don’t know exactly how these defines get codegen'd so I’m not sure if I handled the linux/windows compilation case correctly.",
                            "markup": "markdown",
                            "html": "<p>This allows PyPy to be codesigned with Hardened Runtime on macOS Mojave with <code>com.apple.security.cs.allow-jit</code> instead of <code>com.apple.security.cs.allow-unsigned-executable-memory</code> by mapping executable pages using the MAP_JIT flag to mmap. I’ve confirmed this flag exists at least back to 10.11 (El Capitan). I don’t know exactly how these defines get codegen'd so I’m not sure if I handled the linux/windows compilation case correctly.</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "72a38eb8e613",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/lunixbochs/pypy/commit/72a38eb8e613"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/lunixbochs/pypy/commits/72a38eb8e613"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/lunixbochs/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/lunixbochs/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54278ca9-84ce-4781-82fa-2fd8feb3327e%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "lunixbochs/pypy",
                                "uuid": "{54278ca9-84ce-4781-82fa-2fd8feb3327e}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "comment_count": 5,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-09-22T07:28:06.185477+00:00",
                        "author": {
                            "display_name": "Ryan Hileman",
                            "uuid": "{d12dcc97-5650-4b6d-8b25-81c25cfdba8e}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7Bd12dcc97-5650-4b6d-8b25-81c25cfdba8e%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7Bd12dcc97-5650-4b6d-8b25-81c25cfdba8e%7D/"
                                },
                                "avatar": {
                                    "href": "https://secure.gravatar.com/avatar/87b26931d771f1b1d017c39d6c5c9521?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FRH-3.png"
                                }
                            },
                            "nickname": "lunixbochs",
                            "type": "user",
                            "account_id": "557058:5724de78-f0cd-4347-9f96-4db901f26b2f"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "The second idea from http://doc.pypy.org/en/latest/project-ideas.html .\r\n\r\nThis is a work in progress. Right now that I've gotten through translation & everything seems to work. I wanted to get some early feedback on the approach and various other ideas in this change. There are cases where this change can cause a slowdown, such as\r\n\r\n```\r\n#!python\r\n\r\nx = range(100)\r\nx.pop()\r\ny = x[0:1][:]\r\nx[2] = 3\r\n```\r\n\r\nThere might be a trick to fix this particular case, but you can of course come up with another one. On this note - would anyone know some representative benchmarks to test on? I tested one of my private projects and it seemed a bit faster, but that's not an indicator.\r\n\r\nOne of the thoughts I had while writing this is I'm not sure of the benefit of rerased for the strategy storage. It seems to add an indirection for slightly easier to understand code. Could we simply embed the various typed list pointers in the W_ListObject implementation instead of adding an indirection? It would be nice if rpython allowed this sort of subclass embedding, but I'm not sure it does. Either way - just a thought.",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/mikekap/pypy:14c795b8d634%0D5fa60afb5e51?from_pullrequest_id=282"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/282"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/mikekap/pypy:14c795b8d634%0D5fa60afb5e51?from_pullrequest_id=282"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/282/statuses"
                            }
                        },
                        "title": "Add a copy-on-write slice list strategy",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 282,
                        "destination": {
                            "commit": {
                                "hash": "5fa60afb5e51",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "created_on": "2014-09-23T04:19:13.284913+00:00",
                        "summary": {
                            "raw": "The second idea from http://doc.pypy.org/en/latest/project-ideas.html .\r\n\r\nThis is a work in progress. Right now that I've gotten through translation & everything seems to work. I wanted to get some early feedback on the approach and various other ideas in this change. There are cases where this change can cause a slowdown, such as\r\n\r\n```\r\n#!python\r\n\r\nx = range(100)\r\nx.pop()\r\ny = x[0:1][:]\r\nx[2] = 3\r\n```\r\n\r\nThere might be a trick to fix this particular case, but you can of course come up with another one. On this note - would anyone know some representative benchmarks to test on? I tested one of my private projects and it seemed a bit faster, but that's not an indicator.\r\n\r\nOne of the thoughts I had while writing this is I'm not sure of the benefit of rerased for the strategy storage. It seems to add an indirection for slightly easier to understand code. Could we simply embed the various typed list pointers in the W_ListObject implementation instead of adding an indirection? It would be nice if rpython allowed this sort of subclass embedding, but I'm not sure it does. Either way - just a thought.",
                            "markup": "markdown",
                            "html": "<p>The second idea from <a href=\"http://doc.pypy.org/en/latest/project-ideas.html\" rel=\"nofollow\" class=\"ap-connect-link\">http://doc.pypy.org/en/latest/project-ideas.html</a> .</p>\n<p>This is a work in progress. Right now that I've gotten through translation &amp; everything seems to work. I wanted to get some early feedback on the approach and various other ideas in this change. There are cases where this change can cause a slowdown, such as</p>\n<div class=\"codehilite language-python\"><pre><span></span><span class=\"n\">x</span> <span class=\"o\">=</span> <span class=\"nb\">range</span><span class=\"p\">(</span><span class=\"mi\">100</span><span class=\"p\">)</span>\n<span class=\"n\">x</span><span class=\"o\">.</span><span class=\"n\">pop</span><span class=\"p\">()</span>\n<span class=\"n\">y</span> <span class=\"o\">=</span> <span class=\"n\">x</span><span class=\"p\">[</span><span class=\"mi\">0</span><span class=\"p\">:</span><span class=\"mi\">1</span><span class=\"p\">][:]</span>\n<span class=\"n\">x</span><span class=\"p\">[</span><span class=\"mi\">2</span><span class=\"p\">]</span> <span class=\"o\">=</span> <span class=\"mi\">3</span>\n</pre></div>\n\n\n<p>There might be a trick to fix this particular case, but you can of course come up with another one. On this note - would anyone know some representative benchmarks to test on? I tested one of my private projects and it seemed a bit faster, but that's not an indicator.</p>\n<p>One of the thoughts I had while writing this is I'm not sure of the benefit of rerased for the strategy storage. It seems to add an indirection for slightly easier to understand code. Could we simply embed the various typed list pointers in the W_ListObject implementation instead of adding an indirection? It would be nice if rpython allowed this sort of subclass embedding, but I'm not sure it does. Either way - just a thought.</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "14c795b8d634",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/mikekap/pypy/commit/14c795b8d634"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/mikekap/pypy/commits/14c795b8d634"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/mikekap/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/mikekap/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B01675cd2-f198-4ded-894b-43f46c8967f6%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "mikekap/pypy",
                                "uuid": "{01675cd2-f198-4ded-894b-43f46c8967f6}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "comment_count": 4,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-09-22T07:28:05.331325+00:00",
                        "author": {
                            "display_name": "Mike Kaplinskiy",
                            "uuid": "{082cff17-d95e-4f53-935a-77808de1dbfc}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B082cff17-d95e-4f53-935a-77808de1dbfc%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B082cff17-d95e-4f53-935a-77808de1dbfc%7D/"
                                },
                                "avatar": {
                                    "href": "https://bitbucket.org/account/mikekap/avatar/"
                                }
                            },
                            "nickname": "mikekap",
                            "type": "user",
                            "account_id": null
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "Unsigned integer comparisons now update/propagate integer bounds and can be optimized away based on integer bounds information.",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/mpavone/pypy:9fd1c9e7f3fc%0D5fa60afb5e51?from_pullrequest_id=93"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/93"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/mpavone/pypy:9fd1c9e7f3fc%0D5fa60afb5e51?from_pullrequest_id=93"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/93/statuses"
                            }
                        },
                        "title": "Unsigned integer comparison optimizations",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 93,
                        "destination": {
                            "commit": {
                                "hash": "5fa60afb5e51",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "created_on": "2012-12-03T00:58:44.662926+00:00",
                        "summary": {
                            "raw": "Unsigned integer comparisons now update/propagate integer bounds and can be optimized away based on integer bounds information.",
                            "markup": "markdown",
                            "html": "<p>Unsigned integer comparisons now update/propagate integer bounds and can be optimized away based on integer bounds information.</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "9fd1c9e7f3fc",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/mpavone/pypy/commit/9fd1c9e7f3fc"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/mpavone/pypy/commits/9fd1c9e7f3fc"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/mpavone/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/mpavone/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B040e45ef-e7e6-4492-be06-88af6e7a707c%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "mpavone/pypy",
                                "uuid": "{040e45ef-e7e6-4492-be06-88af6e7a707c}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "comment_count": 0,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-09-22T07:28:04.794255+00:00",
                        "author": {
                            "display_name": "Michael Pavone",
                            "uuid": "{0217a18f-38d2-4910-b578-d85b5b72838f}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B0217a18f-38d2-4910-b578-d85b5b72838f%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B0217a18f-38d2-4910-b578-d85b5b72838f%7D/"
                                },
                                "avatar": {
                                    "href": "https://secure.gravatar.com/avatar/0283f59a8492fed75d106daea47ed8b1?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-3.png"
                                }
                            },
                            "nickname": "mpavone",
                            "type": "user",
                            "account_id": "5bb1d558210f980c53dcaeda"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "Also dropped the set_platform from platform/__init__.py to where it was called from.",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/cheery/pypy:fb44c9885d10%0D5fa60afb5e51?from_pullrequest_id=291"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/291"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/cheery/pypy:fb44c9885d10%0D5fa60afb5e51?from_pullrequest_id=291"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/291/statuses"
                            }
                        },
                        "title": "new translation option: exec-prefix",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 291,
                        "destination": {
                            "commit": {
                                "hash": "5fa60afb5e51",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "created_on": "2014-11-12T09:45:23.637609+00:00",
                        "summary": {
                            "raw": "Also dropped the set_platform from platform/__init__.py to where it was called from.",
                            "markup": "markdown",
                            "html": "<p>Also dropped the set_platform from platform/<strong>init</strong>.py to where it was called from.</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "fb44c9885d10",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/cheery/pypy/commit/fb44c9885d10"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/cheery/pypy/commits/fb44c9885d10"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/cheery/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/cheery/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B425447ab-630b-4d86-ab30-17775b562eb5%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "cheery/pypy",
                                "uuid": "{425447ab-630b-4d86-ab30-17775b562eb5}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "comment_count": 0,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-09-22T07:28:04.342201+00:00",
                        "author": {
                            "display_name": "Henri Tuhola",
                            "uuid": "{7cdb2c5d-39cf-431d-8902-98f6a75e2c58}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B7cdb2c5d-39cf-431d-8902-98f6a75e2c58%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B7cdb2c5d-39cf-431d-8902-98f6a75e2c58%7D/"
                                },
                                "avatar": {
                                    "href": "https://secure.gravatar.com/avatar/46b2686f666f17a9185b71b7a62dc3a6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHT-3.png"
                                }
                            },
                            "nickname": "cheery",
                            "type": "user",
                            "account_id": "5c01d247a424561a8ea5fb62"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "This PR adds several missing posix attributes to fix [#2375](https://bitbucket.org/pypy/pypy/issues/2375/missing-posix-attributes-in-py35). It has implementation for:\r\n\r\n* getgrouplist\r\n* sched\\_rr\\_get\\_interval\r\n* sched\\_getscheduler\r\n* sched\\_setscheduler\r\n* sched\\_getparam\r\n* sched\\_setparam\r\n\r\nWait on Review. I need to fix some branch mixes.",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/nanjekye/pypy:7a4d07b8dddd%0D7392d01b93d0?from_pullrequest_id=639"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/639"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/nanjekye/pypy:7a4d07b8dddd%0D7392d01b93d0?from_pullrequest_id=639"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/639/statuses"
                            }
                        },
                        "title": "missing posix attributes",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 639,
                        "destination": {
                            "commit": {
                                "hash": "7392d01b93d0",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/7392d01b93d0"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/7392d01b93d0"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "py3.6"
                            }
                        },
                        "created_on": "2019-04-05T16:43:22.173110+00:00",
                        "summary": {
                            "raw": "This PR adds several missing posix attributes to fix [#2375](https://bitbucket.org/pypy/pypy/issues/2375/missing-posix-attributes-in-py35). It has implementation for:\r\n\r\n* getgrouplist\r\n* sched\\_rr\\_get\\_interval\r\n* sched\\_getscheduler\r\n* sched\\_setscheduler\r\n* sched\\_getparam\r\n* sched\\_setparam\r\n\r\nWait on Review. I need to fix some branch mixes.",
                            "markup": "markdown",
                            "html": "<p>This PR adds several missing posix attributes to fix <a data-is-external-link=\"true\" href=\"https://bitbucket.org/pypy/pypy/issues/2375/missing-posix-attributes-in-py35\" rel=\"nofollow\">#2375</a>. It has implementation for:</p>\n<ul>\n<li>getgrouplist</li>\n<li>sched_rr_get_interval</li>\n<li>sched_getscheduler</li>\n<li>sched_setscheduler</li>\n<li>sched_getparam</li>\n<li>sched_setparam</li>\n</ul>\n<p>Wait on Review. I need to fix some branch mixes.</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "7a4d07b8dddd",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/nanjekye/pypy/commit/7a4d07b8dddd"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/nanjekye/pypy/commits/7a4d07b8dddd"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/nanjekye/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/nanjekye/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7Bdefa2c2d-3b94-4ee9-b63a-4bd908e705e8%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "nanjekye/pypy",
                                "uuid": "{defa2c2d-3b94-4ee9-b63a-4bd908e705e8}"
                            },
                            "branch": {
                                "name": "sankara"
                            }
                        },
                        "comment_count": 3,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-08-14T20:01:06.689607+00:00",
                        "author": {
                            "display_name": "joannah nanjekye",
                            "uuid": "{961325ae-c2fa-49b9-b4b7-bac9f02775fa}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B961325ae-c2fa-49b9-b4b7-bac9f02775fa%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B961325ae-c2fa-49b9-b4b7-bac9f02775fa%7D/"
                                },
                                "avatar": {
                                    "href": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:90504532-df50-4ff7-bcbd-2685788bb0a4/99544ffa-a567-4920-93ca-d682e586b811/128"
                                }
                            },
                            "nickname": "Joannah Nanjekye",
                            "type": "user",
                            "account_id": "557058:90504532-df50-4ff7-bcbd-2685788bb0a4"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "unix\\_console.py edited online with Bitbucket\r\n\r\nSolution to Error:\r\n\r\nPython 2.7.13 \\(8cdda8b8cdb8ff29d9e620cccd6c5edd2f2a23ec, Apr 22 2019, 17:50:23\\)  \r\n\\[PyPy 7.1.1 with GCC 8.3.0\\] on linux2  \r\nType \"help\", \"copyright\", \"credits\" or \"license\" for more information.\r\n\r\n> Traceback \\(most recent call last\\):  \r\n> File \"/opt/pypy2/lib\\_pypy/\\_pypy\\_interact.py\", line 42, in interactive\\_console  \r\n> run\\_multiline\\_interactive\\_console\\(mainmodule, future\\_flags=future\\_flags\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/simple\\_interact.py\", line 70, in run\\_multiline\\_interactive\\_console  \r\n> returns\\_unicode=True\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/readline.py\", line 271, in multiline\\_input  \r\n> return reader.readline\\(returns\\_unicode=returns\\_unicode\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/reader.py\", line 604, in readline  \r\n> self.handle1\\(\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/reader.py\", line 561, in handle1  \r\n> event = self.console.get\\_event\\(block\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/unix\\_console.py\", line 427, in get\\_event  \r\n> self.push\\_char\\(os.read\\(self.input\\_fd, 1\\)\\)  \r\n> OSError: \\[Errno 11\\] Resource temporarily unavailable",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/kashirin-alex/pypy:483d66c083a7%0D5fa60afb5e51?from_pullrequest_id=644"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/644"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/kashirin-alex/pypy:483d66c083a7%0D5fa60afb5e51?from_pullrequest_id=644"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/644/statuses"
                            }
                        },
                        "title": "unix_console's polled fd need to retry to errno.EWOULDBLOCK",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 644,
                        "destination": {
                            "commit": {
                                "hash": "5fa60afb5e51",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/5fa60afb5e51"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/5fa60afb5e51"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "default"
                            }
                        },
                        "created_on": "2019-04-23T06:37:46.341270+00:00",
                        "summary": {
                            "raw": "unix\\_console.py edited online with Bitbucket\r\n\r\nSolution to Error:\r\n\r\nPython 2.7.13 \\(8cdda8b8cdb8ff29d9e620cccd6c5edd2f2a23ec, Apr 22 2019, 17:50:23\\)  \r\n\\[PyPy 7.1.1 with GCC 8.3.0\\] on linux2  \r\nType \"help\", \"copyright\", \"credits\" or \"license\" for more information.\r\n\r\n> Traceback \\(most recent call last\\):  \r\n> File \"/opt/pypy2/lib\\_pypy/\\_pypy\\_interact.py\", line 42, in interactive\\_console  \r\n> run\\_multiline\\_interactive\\_console\\(mainmodule, future\\_flags=future\\_flags\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/simple\\_interact.py\", line 70, in run\\_multiline\\_interactive\\_console  \r\n> returns\\_unicode=True\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/readline.py\", line 271, in multiline\\_input  \r\n> return reader.readline\\(returns\\_unicode=returns\\_unicode\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/reader.py\", line 604, in readline  \r\n> self.handle1\\(\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/reader.py\", line 561, in handle1  \r\n> event = self.console.get\\_event\\(block\\)  \r\n> File \"/opt/pypy2/lib\\_pypy/pyrepl/unix\\_console.py\", line 427, in get\\_event  \r\n> self.push\\_char\\(os.read\\(self.input\\_fd, 1\\)\\)  \r\n> OSError: \\[Errno 11\\] Resource temporarily unavailable",
                            "markup": "markdown",
                            "html": "<p>unix_console.py edited online with Bitbucket</p>\n<p>Solution to Error:</p>\n<p>Python 2.7.13 (<a href=\"https://api.bitbucket.org/pypy/pypy/commits/8cdda8b8cdb8ff29d9e620cccd6c5edd2f2a23ec\" rel=\"nofollow\" class=\"ap-connect-link\">8cdda8b8cdb8ff29d9e620cccd6c5edd2f2a23ec</a>, Apr 22 2019, 17:50:23)<br />\n[PyPy 7.1.1 with GCC 8.3.0] on linux2<br />\nType \"help\", \"copyright\", \"credits\" or \"license\" for more information.</p>\n<blockquote>\n<p>Traceback (most recent call last):<br />\nFile \"/opt/pypy2/lib_pypy/_pypy_interact.py\", line 42, in interactive_console<br />\nrun_multiline_interactive_console(mainmodule, future_flags=future_flags)<br />\nFile \"/opt/pypy2/lib_pypy/pyrepl/simple_interact.py\", line 70, in run_multiline_interactive_console<br />\nreturns_unicode=True)<br />\nFile \"/opt/pypy2/lib_pypy/pyrepl/readline.py\", line 271, in multiline_input<br />\nreturn reader.readline(returns_unicode=returns_unicode)<br />\nFile \"/opt/pypy2/lib_pypy/pyrepl/reader.py\", line 604, in readline<br />\nself.handle1()<br />\nFile \"/opt/pypy2/lib_pypy/pyrepl/reader.py\", line 561, in handle1<br />\nevent = self.console.get_event(block)<br />\nFile \"/opt/pypy2/lib_pypy/pyrepl/unix_console.py\", line 427, in get_event<br />\nself.push_char(os.read(self.input_fd, 1))<br />\nOSError: [Errno 11] Resource temporarily unavailable</p>\n</blockquote>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "483d66c083a7",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/kashirin-alex/pypy/commit/483d66c083a7"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/kashirin-alex/pypy/commits/483d66c083a7"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/kashirin-alex/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/kashirin-alex/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B7323288f-e126-4803-ae64-e26ffd98ffad%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "kashirin-alex/pypy",
                                "uuid": "{7323288f-e126-4803-ae64-e26ffd98ffad}"
                            },
                            "branch": {
                                "name": "kashirin-alex/unix_consolepy-edited-online-with-bitbuc-1556000991814"
                            }
                        },
                        "comment_count": 9,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-06-26T11:52:04.403408+00:00",
                        "author": {
                            "display_name": "Alex Kashirin",
                            "uuid": "{e37c3e5f-12f8-4f36-8208-59a39a87d0a6}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7Be37c3e5f-12f8-4f36-8208-59a39a87d0a6%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7Be37c3e5f-12f8-4f36-8208-59a39a87d0a6%7D/"
                                },
                                "avatar": {
                                    "href": "https://secure.gravatar.com/avatar/45e13408c00c9e911dd8e358ca83fe2c?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAK-3.png"
                                }
                            },
                            "nickname": "kashirin-alex",
                            "type": "user",
                            "account_id": "557058:6f57b77a-d6f1-4109-8ba5-0a4d5a6923eb"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "Fixes \\[issue 2986\\]\\([https://bitbucket.org/pypy/pypy/issues/2986/cpyext-missing-fromtimestamp-methods-in](https://bitbucket.org/pypy/pypy/issues/2986/cpyext-missing-fromtimestamp-methods-in)\\)",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/nanjekye/pypy:6ec8c5dcad5a%0D7392d01b93d0?from_pullrequest_id=638"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/638"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/nanjekye/pypy:6ec8c5dcad5a%0D7392d01b93d0?from_pullrequest_id=638"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/638/statuses"
                            }
                        },
                        "title": "cpyext missing FromTimestamp methods in PyDatetime_CAPI",
                        "close_source_branch": false,
                        "type": "pullrequest",
                        "id": 638,
                        "destination": {
                            "commit": {
                                "hash": "7392d01b93d0",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/7392d01b93d0"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/7392d01b93d0"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "py3.6"
                            }
                        },
                        "created_on": "2019-04-03T14:47:07.962992+00:00",
                        "summary": {
                            "raw": "Fixes \\[issue 2986\\]\\([https://bitbucket.org/pypy/pypy/issues/2986/cpyext-missing-fromtimestamp-methods-in](https://bitbucket.org/pypy/pypy/issues/2986/cpyext-missing-fromtimestamp-methods-in)\\)",
                            "markup": "markdown",
                            "html": "<p>Fixes [issue 2986](<a data-is-external-link=\"true\" href=\"https://bitbucket.org/pypy/pypy/issues/2986/cpyext-missing-fromtimestamp-methods-in\" rel=\"nofollow\">https://bitbucket.org/pypy/pypy/issues/2986/cpyext-missing-fromtimestamp-methods-in</a>)</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "6ec8c5dcad5a",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/nanjekye/pypy/commit/6ec8c5dcad5a"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/nanjekye/pypy/commits/6ec8c5dcad5a"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/nanjekye/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/nanjekye/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7Bdefa2c2d-3b94-4ee9-b63a-4bd908e705e8%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "nanjekye/pypy",
                                "uuid": "{defa2c2d-3b94-4ee9-b63a-4bd908e705e8}"
                            },
                            "branch": {
                                "name": "missing"
                            }
                        },
                        "comment_count": 1,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2019-04-04T08:06:51.175322+00:00",
                        "author": {
                            "display_name": "joannah nanjekye",
                            "uuid": "{961325ae-c2fa-49b9-b4b7-bac9f02775fa}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7B961325ae-c2fa-49b9-b4b7-bac9f02775fa%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7B961325ae-c2fa-49b9-b4b7-bac9f02775fa%7D/"
                                },
                                "avatar": {
                                    "href": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:90504532-df50-4ff7-bcbd-2685788bb0a4/99544ffa-a567-4920-93ca-d682e586b811/128"
                                }
                            },
                            "nickname": "Joannah Nanjekye",
                            "type": "user",
                            "account_id": "557058:90504532-df50-4ff7-bcbd-2685788bb0a4"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    },
                    {
                        "description": "This fixes the test failures in ﻿`lib-python/3/test/test_grammar.py` `test_var_annot_syntax_errors` and `test_var_annot_basic_semantics`.\r\n\r\nThey're error cases that weren't handled correctly before.",
                        "links": {
                            "decline": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613/decline"
                            },
                            "diffstat": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diffstat/alcarithemad/pypy:17cddba820f6%0D7392d01b93d0?from_pullrequest_id=613"
                            },
                            "commits": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613/commits"
                            },
                            "self": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613"
                            },
                            "comments": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613/comments"
                            },
                            "merge": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613/merge"
                            },
                            "html": {
                                "href": "https://bitbucket.org/pypy/pypy/pull-requests/613"
                            },
                            "activity": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613/activity"
                            },
                            "diff": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/diff/alcarithemad/pypy:17cddba820f6%0D7392d01b93d0?from_pullrequest_id=613"
                            },
                            "approve": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613/approve"
                            },
                            "statuses": {
                                "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests/613/statuses"
                            }
                        },
                        "title": "Pep526 fixes",
                        "close_source_branch": true,
                        "type": "pullrequest",
                        "id": 613,
                        "destination": {
                            "commit": {
                                "hash": "7392d01b93d0",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/commit/7392d01b93d0"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy/commits/7392d01b93d0"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/pypy/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/pypy/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B54220cd1-b139-4188-9455-1e13e663f1ac%7D?ts=105930"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "pypy/pypy",
                                "uuid": "{54220cd1-b139-4188-9455-1e13e663f1ac}"
                            },
                            "branch": {
                                "name": "py3.6"
                            }
                        },
                        "created_on": "2018-05-14T18:18:23.957827+00:00",
                        "summary": {
                            "raw": "This fixes the test failures in ﻿`lib-python/3/test/test_grammar.py` `test_var_annot_syntax_errors` and `test_var_annot_basic_semantics`.\r\n\r\nThey're error cases that weren't handled correctly before.",
                            "markup": "markdown",
                            "html": "<p>This fixes the test failures in ﻿<code>lib-python/3/test/test_grammar.py</code> <code>test_var_annot_syntax_errors</code> and <code>test_var_annot_basic_semantics</code>.</p>\n<p>They're error cases that weren't handled correctly before.</p>",
                            "type": "rendered"
                        },
                        "source": {
                            "commit": {
                                "hash": "17cddba820f6",
                                "type": "commit",
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/alcarithemad/pypy/commit/17cddba820f6"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/alcarithemad/pypy/commits/17cddba820f6"
                                    }
                                }
                            },
                            "repository": {
                                "links": {
                                    "self": {
                                        "href": "https://api.bitbucket.org/2.0/repositories/alcarithemad/pypy"
                                    },
                                    "html": {
                                        "href": "https://bitbucket.org/alcarithemad/pypy"
                                    },
                                    "avatar": {
                                        "href": "https://bytebucket.org/ravatar/%7B71e923bb-ea96-456f-9c6e-2dccdd0f6e39%7D?ts=python"
                                    }
                                },
                                "type": "repository",
                                "name": "pypy",
                                "full_name": "alcarithemad/pypy",
                                "uuid": "{71e923bb-ea96-456f-9c6e-2dccdd0f6e39}"
                            },
                            "branch": {
                                "name": "pep526-fixes"
                            }
                        },
                        "comment_count": 1,
                        "state": "OPEN",
                        "task_count": 0,
                        "reason": "",
                        "updated_on": "2018-06-02T08:00:40.806101+00:00",
                        "author": {
                            "display_name": "Colin",
                            "uuid": "{ae0584be-fa2e-4f77-b406-36aa6c57d806}",
                            "links": {
                                "self": {
                                    "href": "https://api.bitbucket.org/2.0/users/%7Bae0584be-fa2e-4f77-b406-36aa6c57d806%7D"
                                },
                                "html": {
                                    "href": "https://bitbucket.org/%7Bae0584be-fa2e-4f77-b406-36aa6c57d806%7D/"
                                },
                                "avatar": {
                                    "href": "https://secure.gravatar.com/avatar/43c472f28335c57017ae2d396cd32827?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FC-3.png"
                                }
                            },
                            "nickname": "alcarithemad",
                            "type": "user",
                            "account_id": "5a7f672d4b03dd57b01aa49a"
                        },
                        "merge_commit": null,
                        "closed_by": null
                    }
                ],
                "page": 1,
                "next": "https://api.bitbucket.org/2.0/repositories/pypy/pypy/pullrequests?page=2"
            }
            //new BitbucketNock(1, 'pypy', 1, 'pypy').getPulls([{ number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' }])
            const bitbucketNock = nock('https://api.bitbucket.org/2.0')
            bitbucketNock.get('/repositories/pypy/pypy/pullrequests').reply(200, reply)
            const response = await service.getPullRequests('pypy', 'pypy');
            console.log(response);
            expect(response)
        })
    })
    // it('purges the cache', async () => {
    //   new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', 'before', undefined, false);
    //   await service.getRepoContent('octocat', 'Hello-World', 'README');

    //   service.purgeCache();

    //   new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', 'after');
    //   const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
    //   expect(((response as unknown) as File).content).toEqual('YWZ0ZXI=');
    // });

    //     it('returns pulls in own interface', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls([
    //         { number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' },
    //       ]);

    //       const response = await service.getPullRequests('octocat', 'Hello-World');
    //       expect(response).toMatchObject(getPullsServiceResponse);
    //     });

    //     it('returns open pulls by default', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls([
    //         { number: 1347, state: 'open', title: 'new-feature', body: 'Please pull these awesome changes', head: 'new-topic', base: 'master' },
    //       ]);

    //       const response = await service.getPullRequests('octocat', 'Hello-World');
    //       expect(response.items.map((item) => item.state)).toMatchObject(['open']);
    //     });

    //     it('returns open pulls', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls(
    //         [{ number: 1347, state: 'open', title: 'new-feature', body: '', head: 'new-topic', base: 'master' }],
    //         'open',
    //       );

    //       const response = await service.getPullRequests('octocat', 'Hello-World', { filter: { state: GitHubPullRequestState.open } });
    //       expect(response.items.map((item) => item.state)).toMatchObject(['open']);
    //     });

    //     it('returns closed pulls', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls(
    //         [{ number: 1347, state: 'closed', title: 'new-feature', body: '', head: 'new-topic', base: 'master' }],
    //         'closed',
    //       );

    //       const response = await service.getPullRequests('octocat', 'Hello-World', { filter: { state: GitHubPullRequestState.closed } });
    //       expect(response.items.map((item) => item.state)).toMatchObject(['closed']);
    //     });

    //     it('returns all pulls', async () => {
    //       new BitbucketNock(1, 'octocat', 1296269, 'Hello-World').getPulls(
    //         [
    //           { number: 1347, state: 'open', title: 'new-feature', body: '', head: 'new-topic', base: 'master' },
    //           { number: 1348, state: 'closed', title: 'new-feature', body: '', head: 'new-topic', base: 'master' },
    //         ],
    //         'all',
    //       );

    //       const response = await service.getPullRequests('octocat', 'Hello-World', { filter: { state: GitHubPullRequestState.all } });
    //       expect(response.items.map((item) => item.state)).toMatchObject(['open', 'closed']);
    //     });
    //   });

    //   it('returns pull request reviews in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/reviews').reply(200, getPullRequestsReviewsResponse);

    //     const response = await service.getPullRequestReviews('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getPullsReviewsServiceResponse);
    //   });

    //   it('returns commits in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getCommits().reply(200, getRepoCommitsResponse);
    //     const response = await service.getRepoCommits('octocat', 'Hello-World');

    //     expect(response.data).toMatchObject(getRepoCommitsResponse);
    //   });

    //   it('returns commits in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getGitCommits('762941318ee16e59dabbacb1b4049eec22f0d303').reply(200, getCommitResponse);

    //     const response = await service.getCommit('octocat', 'Hello-World', '762941318ee16e59dabbacb1b4049eec22f0d303');
    //     expect(response).toMatchObject(getCommitServiceResponse);
    //   });

    //   it('returns contributors in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getContributors([{ id: 251370, login: 'Spaceghost' }, { id: 583231, login: 'octocat' }]);

    //     const response = await service.getContributors('octocat', 'Hello-World');
    //     expect(response).toMatchObject(getContributorsServiceResponse);
    //   });

    //   it('returns contributor stats in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/stats/contributors').reply(200, getContributorsStatsResponse);

    //     const response = await service.getContributorsStats('octocat', 'Hello-World');
    //     expect(response).toMatchObject(getContributorsStatsServiceResponse);
    //   });

    //   describe('#getRepoContent', () => {
    //     it('returns files in own interface', async () => {
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', 'Hello World!\n', '980a0d5f19a64b4b30a87d4206aade58726b60e3');

    //       const response = await service.getRepoContent('octocat', 'Hello-World', 'README');
    //       expect(response).toMatchObject(getRepoContentServiceResponseFile);
    //     });

    //     it('returns directories in own interface', async () => {
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getDirectory('mockFolder', ['mockFile.ts'], []);

    //       const response = await service.getRepoContent('octocat', 'Hello-World', 'mockFolder');
    //       expect(response).toMatchObject(getRepoContentServiceResponseDir);
    //     });

    //     it("returns null if the path doesn't exists", async () => {
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getNonexistentContents('notExistingMockFolder');

    //       const result = await service.getRepoContent('octocat', 'Hello-World', 'notExistingMockFolder');

    //       expect(result).toBe(null);
    //     });

    //     it('caches the results', async () => {
    //       // bacause of persist == false, the second call to service.getRepoContent() would cause Nock to throw an error if the cache wasn't used
    //       new BitbucketNock(1, 'octocat', 1, 'Hello-World').getFile('README', undefined, undefined, false);
    //       await service.getRepoContent('octocat', 'Hello-World', 'README');

    //       await service.getRepoContent('octocat', 'Hello-World', 'README');
    //     });
    //   });

    //   it('returns issues in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getIssues().reply(200, getIssuesResponse);

    //     const response = await service.getIssues('octocat', 'Hello-World');
    //     expect(response).toMatchObject(getIssuesServiceResponse);
    //   });

    //   it('returns comments in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    //     const response = await service.getIssueComments('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getIssueCommentsServiceResponse);
    //   });

    //   it('returns commits in own interfa', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/issues/1/comments').reply(200, getIssueCommentsResponse);

    //     const response = await service.getIssueComments('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getIssueCommentsServiceResponse);
    //   });

    //   it('returns pull files in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/files').reply(200, getPullsFilesResponse);

    //     const response = await service.getPullRequestFiles('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getPullsFilesServiceResponse);
    //   });

    //   it('returns pull commits in own interface', async () => {
    //     new BitbucketNock(1, 'octocat', 1, 'Hello-World').getRepo('/pulls/1/commits').reply(200, getPullCommitsResponse);

    //     const response = await service.getPullCommits('octocat', 'Hello-World', 1);
    //     expect(response).toMatchObject(getPullCommitsServiceResponse);
    //   });
});
