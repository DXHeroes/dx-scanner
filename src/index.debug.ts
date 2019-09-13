import 'reflect-metadata';
import { createRootContainer } from './inversify.config';
import { Scanner } from './scanner/Scanner';

const uri = 'https://github.com/facebook/react';

const debugRun = async () => {
  const container = createRootContainer({ uri: uri || process.cwd() });
  const scanner = container.get(Scanner);
  await scanner.scan();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
debugRun();
