import { UserItem } from '../../../../test/helpers/gitHubNock';
export declare const getPullCommitsResponse: {
    sha: string;
    node_id: string;
    commit: {
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
        message: string;
        tree: {
            sha: string;
            url: string;
        };
        url: string;
        comment_count: number;
        verification: {
            verified: boolean;
            reason: string;
            signature: null;
            payload: null;
        };
    };
    url: string;
    html_url: string;
    comments_url: string;
    author: UserItem;
    committer: UserItem;
    parents: {
        sha: string;
        url: string;
        html_url: string;
    }[];
}[];
//# sourceMappingURL=getPullsCommitsResponse.mock.d.ts.map