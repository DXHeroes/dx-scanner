declare module 'parse-commit-message' {
  let parser: {
    validate(commits: string[] | string, ret: boolean): boolean;
    validateCommit(commit: object, ret: boolean): boolean;
    parseCommit(commit: string): ParseCommitMessageCommit;
  };
  export = parser;
}

type ParseCommitMessageHeader = {
  type: string;
  scope?: string | null;
  subject: string;
};

type ParseCommitMessageCommit = {
  header: ParseCommitMessageHeader;
  body?: string | null;
  footer?: string | null;
  increment?: string | boolean;
  isBreaking?: boolean;
  mentions?: Array<ParseCommitMessageMention>;
};

type ParseCommitMessageMention = {
  handle: string;
  mention: string;
  index: number;
};
