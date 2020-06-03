declare module 'yeoman-gen-run' {
  export function runGenerator(
    genName: string,
    config: { answers?: Record<string, unknown>; options?: Record<string, unknown>; cli?: Record<string, unknown> },
    outDir?: string,
  ): Promise<void>;
}
