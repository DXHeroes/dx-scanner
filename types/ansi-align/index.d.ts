declare module 'ansi-align' {
  let ansiAlign: <T extends string | string[]>(text: T, options?: { align: string; split: string | RegExp; pad: string }) => string;
  export = ansiAlign;
}
