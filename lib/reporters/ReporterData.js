"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportDetailType = exports.ReporterData = void 0;
const table_1 = require("table");
class ReporterData {
}
exports.ReporterData = ReporterData;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ReporterData.table = (headers, data, userConfig) => {
    const tableData = data.map(Object.values);
    tableData.unshift(headers);
    return table_1.table(tableData, Object.assign({
        border: table_1.getBorderCharacters('norc'),
        singleLine: false,
        drawHorizontalLine: (i) => i === 1 || i === 0 || i === tableData.length,
    }, userConfig));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ReporterData.markdownTable = (headers, data, userConfig) => {
    const tableBorders = {
        topBody: '',
        topJoin: '',
        topLeft: '',
        topRight: '',
        bottomBody: '',
        bottomJoin: '',
        bottomLeft: '',
        bottomRight: '',
        bodyLeft: '',
        bodyRight: '',
        bodyJoin: '|',
        joinBody: `-`,
        joinLeft: '',
        joinRight: '',
        joinJoin: ` | `,
    };
    return ReporterData.table(headers, data, Object.assign({
        border: tableBorders,
        singleLine: false,
        drawHorizontalLine: (i) => i === 1,
    }, userConfig));
};
var ReportDetailType;
(function (ReportDetailType) {
    ReportDetailType["table"] = "table";
    ReportDetailType["text"] = "text";
})(ReportDetailType = exports.ReportDetailType || (exports.ReportDetailType = {}));
//# sourceMappingURL=ReporterData.js.map