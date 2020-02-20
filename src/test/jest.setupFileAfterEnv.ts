import nock from 'nock';

beforeEach(() => {
  nock.cleanAll();
});

afterAll(() => {
  nock.restore();
});
