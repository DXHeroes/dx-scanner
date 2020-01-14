declare module '@commitlint/lint' {
  interface WarnAndErr {
    level: number;
    valid: boolean;
    name: string;
    message: string;
  }
  interface CommitLintFn {
    (message: string, rules: Record<string, (number | string | string[])[]>): Promise<{
      input: string;
      valid: boolean;
      errors: WarnAndErr[];
      warnings: WarnAndErr[];
    }>;
  }

  const lint: CommitLintFn;

  export = lint;
}

declare module '@commitlint/config-conventional' {
  interface CommitRules {
    rules: Record<string, (string | number | string[])[]>;
    parserPreset: string;
  }

  const rules: CommitRules;

  export = rules;
}
