"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertNever_1 = require("./assertNever");
describe('AssertNever', () => {
    it('Throws error if it is called', () => {
        const x = () => {
            const result = [];
            return result[0];
        };
        expect(() => {
            assertNever_1.assertNever(x());
        }).toThrowError('Unexpected object: ' + x());
    });
});
//# sourceMappingURL=assertNever.spec.js.map