import { grey } from 'colors';
import debug from 'debug';

/**
 * Class decorator enhancing all its functions to be time measurable
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const measurable = () => (target: Function): any => {
  const timersDebug = debug('timers');

  for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
    if (!descriptor) continue;

    const isMethod = descriptor.value instanceof Function;
    if (!isMethod) continue;

    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function(...args: any[]) {
      const hrstart = process.hrtime();
      const result = originalMethod.apply(this, args);
      const hrend = process.hrtime(hrstart);
      timersDebug(`Execution time: %ds %dms [${grey(target.name + '#' + propertyName)}]`, hrend[0], hrend[1] / 1000000);
      return result;
    };

    Object.defineProperty(target.prototype, propertyName, descriptor);
  }

  return target;
};
