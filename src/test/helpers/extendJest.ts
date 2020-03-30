/* eslint-disable @typescript-eslint/no-namespace */
export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(object: Record<string, any>): Promise<object>;
    }
  }
}

expect.extend({
  async toContainObject(response: Array<Record<string, any>>, object: Record<string, any>) {
    const pass = this.equals(response, expect.arrayContaining([expect.objectContaining(object)]));

    if (pass) {
      return {
        message: () => `expected ${this.utils.printReceived(response)} not to contain object ${this.utils.printExpected(object)}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${this.utils.printReceived(response)} to contain object ${this.utils.printExpected(object)}`,
        pass: false,
      };
    }
  },
});
