"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONUtils_1 = require("./JSONUtils");
describe('JSONUtils', () => {
    describe('#asJSON', () => {
        it('should read file as JSON', async () => {
            const result = JSONUtils_1.JSONUtils.readAsJSON('{"key":"value"}');
            expect(result).toEqual({ key: 'value' });
        });
        it('should throw error if the content is not JSON', async () => {
            expect(() => {
                JSONUtils_1.JSONUtils.readAsJSON('string');
            }).toThrow('JSON parse error');
        });
    });
});
//# sourceMappingURL=JSONUtils.spec.js.map