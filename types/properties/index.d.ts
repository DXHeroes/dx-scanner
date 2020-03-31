declare module 'properties' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function parse(fileName: string, options?: Options, callback?: (err: any, obj: any) => any): Promise<Record<string, any>>;

  interface Options {
    path?: boolean;
    namespaces?: boolean;
    sections?: boolean;
    variables?: boolean;
    include?: boolean;
  }
}
