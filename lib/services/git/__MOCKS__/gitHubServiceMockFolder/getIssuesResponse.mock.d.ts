import { UserItem } from '../../../../test/helpers/gitHubNock';
export declare const getIssuesResponse: ({
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: UserItem;
    labels: never[];
    state: string;
    locked: boolean;
    assignee: null;
    assignees: never[];
    milestone: null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: null;
    author_association: string;
    pull_request: {
        url: string;
        html_url: string;
        diff_url: string;
        patch_url: string;
    };
    body: string;
    headers?: undefined;
} | {
    headers: {
        link: string;
    };
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: UserItem;
    labels: never[];
    state: string;
    locked: boolean;
    assignee: null;
    assignees: never[];
    milestone: null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: null;
    author_association: string;
    pull_request: {
        url: string;
        html_url: string;
        diff_url: string;
        patch_url: string;
    };
    body: string;
})[];
//# sourceMappingURL=getIssuesResponse.mock.d.ts.map