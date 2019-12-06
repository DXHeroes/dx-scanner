declare module 'parse-commit-message' {
  let parser: {
    validate(commits: string[] | string, ret: boolean): boolean;
    validateCommit(commit: object, ret: boolean): boolean;
    parseCommit(commit: string): Commit;
  };
  export = parser;
}

type Header = {
  type: string;
  scope?: string | null;
  subject: string;
};

type Commit = {
  header: Header;
  body?: string | null;
  footer?: string | null;
  increment?: string | boolean;
  isBreaking?: boolean;
  mentions?: Array<Mention>;
};

type Mention = {
  handle: string;
  mention: string;
  index: number;
};
