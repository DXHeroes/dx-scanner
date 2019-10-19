interface NCUParams {
  packageData: string;
}

declare module 'npm-check-updates' {
  let ncu: { run(params: NCUParams): Promise<{ [key: string]: string }> };
  export = ncu;
}

declare module 'gradle-to-js' {
  export function parseText(text: string): Promise<BuildGradle>;
  export function parseFile(filePath: string): Promise<BuildGradle>;

  export interface BuildGradle {
    plugins: [];
    group: string;
    version: string;
    sourceCompatibility: string;
    repositories: [];
    dependencies: [
      {
        group: string;
        name: string;
        version: string;
        type: string;
        excludes: [];
      },
    ];
  }
}
