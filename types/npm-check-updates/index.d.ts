interface NCUParams {
  packageData?: string;
  filter?: string;
  upgrade?: boolean;
}

declare module 'npm-check-updates' {
  let ncu: { run(params: NCUParams): Promise<{ [key: string]: string }> };
  export = ncu;
}
