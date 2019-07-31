export interface ICache {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  purge(): void;
  delete<T>(key: string): T | undefined;
  getOrSet<T>(key: string, setter: () => Promise<T>): Promise<T>;
}
