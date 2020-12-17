"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
describe('Params Serializer', () => {
    let parsedParams;
    let expectedParsedParams;
    it('it should serialize params', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parser = function (params) {
            return qs_1.default.stringify(params, { arrayFormat: 'repeat', encode: false });
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
//# sourceMappingURL=ParamsSerializer.spec.js.map