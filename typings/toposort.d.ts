/**
 * Workaround - waiting for merge of https://github.com/DefinitelyTyped/DefinitelyTyped/pull/37104
 */
declare module 'toposort' {
  function sort(graph: [string, (string | undefined)][]): string[];
  export = sort;
}
