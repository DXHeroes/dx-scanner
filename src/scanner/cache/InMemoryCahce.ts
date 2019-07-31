import { ICache } from './ICache';
import { injectable } from 'inversify';

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
    if (previous) {
      return previous as T;
    }
    const newValue = await setter();
    this.set(key, newValue);
    return newValue;
  }
}
