import { JSONUtils } from './JSONUtils';

describe('JSONUtils', () => {
  describe('#asJSON', () => {
    it('should read file as JSON', async () => {
      const result = JSONUtils.readAsJSON('{"key":"value"}');

      expect(result).toEqual({ key: 'value' });
    });

    it('should throw error if the content is not JSON', async () => {
      expect(() => {
        JSONUtils.readAsJSON('string');
      }).toThrow('JSON parse error');
    });
  });
});
