interface NCUParams {
  packageData: string;
}

declare module 'npm-check-updates' {
  let ncu: { run(params: NCUParams): Promise<{ [key: string]: string }> };
  export = ncu;
}
