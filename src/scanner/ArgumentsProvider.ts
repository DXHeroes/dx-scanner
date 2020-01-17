import { PracticeImpact } from '../model';

export type ArgumentsProvider = {
  uri: string;
  auth: string | undefined;
  json: boolean | undefined;
  fail: PracticeImpact | 'all';
  recursive: boolean;
  ci: boolean;
  fix: boolean;
};
