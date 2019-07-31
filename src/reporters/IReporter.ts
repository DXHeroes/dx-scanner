import { PracticeAndComponent } from '../model';

export interface IReporter {
  report(practicesAndComponents: PracticeAndComponent[]): string;
}
