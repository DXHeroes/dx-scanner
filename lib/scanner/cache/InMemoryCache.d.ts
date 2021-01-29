import { ICache } from './ICache';
export declare class InMemoryCache implements ICache {
    private storage;
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T): void;
    purge(): void;
    delete<T>(key: string): T | undefined;
    getOrSet<T>(key: string, setter: () => Promise<T>): Promise<T>;
}
//# sourceMappingURL=InMemoryCache.d.ts.map