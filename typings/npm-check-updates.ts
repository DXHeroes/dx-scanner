interface NCUParams {
  packageData: string;
}

declare module 'npm-check-updates' {
  let ncu: { run(params: NCUParams): Promise<{ [key: string]: string }> };
  export = ncu;
}

declare module 'gradle-to-js' {
  export function parseText(text: string): any;
  export function parseFile(filePath: string): any;
}
