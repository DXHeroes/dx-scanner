import { PracticeImpact } from '../model';
export declare type ArgumentsProvider = {
    uri: string;
    auth: string | undefined;
    json: boolean;
    details: boolean;
    fail: PracticeImpact | 'all';
    recursive: boolean;
    ci: boolean;
    fix: boolean;
    fixPattern: string | undefined;
    html: string | boolean;
    apiToken: string | undefined;
    apiUrl: string;
};
//# sourceMappingURL=ArgumentsProvider.d.ts.map