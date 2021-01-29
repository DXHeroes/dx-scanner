"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReporterData_1 = require("./ReporterData");
describe('ReporterData', () => {
    describe('#markdownTable', () => {
        it('renders md table in correct format', () => {
            const mdTable = ReporterData_1.ReporterData.markdownTable(['th1', 'th2', 'th3'], [
                { td11: 'td11', td12: 'td12', td13: 'td13' },
                { td21: 'td21', td22: 'td22', td23: 'td23' },
            ]);
            expect(mdTable).toEqual(' th1  | th2  | th3  \n------ | ------ | ------\n td11 | td12 | td13 \n td21 | td22 | td23 \n');
        });
    });
});
//# sourceMappingURL=ReporterData.spec.js.map