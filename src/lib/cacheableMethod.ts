import debug from 'debug';

export const cacheableMethod = (target: any, propertyName: string, propertyDesrciptor: PropertyDescriptor): PropertyDescriptor => {
  const method = propertyDesrciptor.value;

  propertyDesrciptor.value = function(...args: any[]) {
    // convert list of greet arguments to string
    const params = args.map((a) => JSON.stringify(a)).join();

    // invoke greet() and get its return value
    const result = method.apply(this, args);

    debug('cache:decorator')(`fn #${propertyName}`);
    debug('cache:decorator')(`params: ${params}`);

    debug('cache:decorator')(target.cache);
    debug('cache:decorator')(target.cache === undefined);

    if (target.cache === undefined) throw 'eee';

    return target.cache.getOrSet(`#${propertyName}_params${params}`, async () => {
      debug('cache:decorator')('runing');
      if (result instanceof Promise) {
        return result.then(
          (res) => {
            debug('cache:decorator')(`promise result: ${JSON.stringify(res)}`);
            return res();
          },
          (err) => {
            throw err;
          },
        );
      } else {
        debug('cache:decorator')(`common result: ${JSON.stringify(result)}`);
        return result;
      }
    });
  };

  return propertyDesrciptor;
};
