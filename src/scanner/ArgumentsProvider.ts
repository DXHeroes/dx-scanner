import { PracticeImpact } from '../model';

export type ArgumentsProvider = {
  uri: string;
  auth: string | undefined;
  json: boolean;
  details: boolean;
  fail: PracticeImpact | 'all';
  recursive: boolean;
  ci: boolean;
  fix: boolean;
  fixPattern: string | undefined;
  html: string | undefined;
};
