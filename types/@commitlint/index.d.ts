declare module '@commitlint/lint' {
  interface CommitLintFn {
    (message: string, rules: Record<string, (number | string | string[])[]>): Promise<{
      input: string;
      valid: boolean;
      errors: string[];
      warnings: {
        level: number;
        valid: boolean;
        name: string;
        message: string;
      }[];
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
