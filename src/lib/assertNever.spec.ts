import { assertNever } from './assertNever';

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
