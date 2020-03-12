declare module 'yeoman-gen-run' {
  export function runGenerator(
    genName: string,
    config: { answers?: object; options?: object; cli?: object },
    outDir?: string,
  ): Promise<void>;
}
