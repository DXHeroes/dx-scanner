import { assertNever } from './assertNever';
import { ProgrammingLanguage, PracticeImpact } from '../model';
import { PracticeDetail } from '../practices/IPractice';
import { ReportDetailType, ReporterData } from '../reporters/ReporterData';

describe('AssertNever', () => {
  it('Throws error if it is called', () => {
    const x = () => {
      const result: never[] = [];
      return result[0];
    };

    expect(() => {
      assertNever(x());
    }).toThrowError('Unexpected object: ' + x());
  });
});
