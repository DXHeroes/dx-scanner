import qs from 'qs';

describe('Params Serializer', () => {
  let parsedParams;
  let expectedParsedParams;

  it('it should serialize params', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parser = function (params: any) {
      return qs.stringify(params, { arrayFormat: 'repeat', encode: false });
    };

    parsedParams = parser({ state: ['OPEN', 'MERGED', 'DECLINED'] });
    expectedParsedParams = 'state=OPEN&state=MERGED&state=DECLINED';

    expect(parsedParams).toEqual(expectedParsedParams);

    parsedParams = parser({ state: ['DECLINED', 'OPEN', 'MERGED'] });
    expectedParsedParams = 'state=DECLINED&state=OPEN&state=MERGED';

    expect(parsedParams).toEqual(expectedParsedParams);

    parsedParams = parser({ state: ['DECLINED', 'MERGED'] });
    expectedParsedParams = 'state=DECLINED&state=MERGED';

    expect(parsedParams).toEqual(expectedParsedParams);

    parsedParams = parser({ state: ['MERGED', 'DECLINED'] });
    expectedParsedParams = 'state=MERGED&state=DECLINED';

    expect(parsedParams).toEqual(expectedParsedParams);

    parsedParams = parser({ state: ['MERGED'] });
    expectedParsedParams = 'state=MERGED';

    expect(parsedParams).toEqual(expectedParsedParams);
  });
});
