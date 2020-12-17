export declare const getCommitResponse: {
    sha: string;
    node_id: string;
    url: string;
    html_url: string;
    author: {
        name: string;
        email: string;
        date: string;
    };
    committer: {
        name: string;
        email: string;
        date: string;
    };
    tree: {
        sha: string;
        url: string;
    };
    message: string;
    parents: {
        sha: string;
        url: string;
        html_url: string;
    }[];
    verification: {
        verified: boolean;
        reason: string;
        signature: null;
        payload: null;
    };
};
//# sourceMappingURL=getCommitResponse.mock.d.ts.map