import { ICache } from './ICache';
import { injectable } from 'inversify';
import debug from 'debug';

@injectable()
export class InMemoryCache implements ICache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private storage: { [key: string]: any } = {};

  get<T>(key: string): T | undefined {
    return this.storage[key];
  }

  set<T>(key: string, value: T): void {
    this.storage[key] = value;
  }

  purge(): void {
    this.storage = {};
  }

  delete<T>(key: string): T | undefined {
    const previous = this.get(key);
    this.storage[key] = undefined;
    return previous as T | undefined;
  }

  async getOrSet<T>(key: string, setter: () => Promise<T>): Promise<T> {
    const previous = this.get(key);
    if (previous !== undefined) {
      debug('cache')(`key ${key} already cached`);
      return previous as T;
    }
    const newValue = await setter();
    this.set(key, newValue);
    debug('cache')(`key ${key} cache created`);
    return newValue;
  }
}
