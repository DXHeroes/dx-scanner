declare module 'gitignore' {
  import { Writable } from 'stream';

  export function getTypes(callback?: (err?: Error, types?: string[]) => void): void;
  export function writeFile(options: { type: string; file?: Writable; writable?: Writable }, callback?: (err?: Error) => void): void;
}
