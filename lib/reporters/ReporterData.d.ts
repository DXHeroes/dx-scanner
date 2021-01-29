import { TableUserConfig } from 'table';
export declare class ReporterData {
    static table: (headers: string[], data: Record<string, any>[], userConfig?: TableUserConfig | undefined) => string;
    static markdownTable: (headers: string[], data: Record<string, any>[], userConfig?: TableUserConfig | undefined) => string;
}
export declare type ReportTable = {
    type: ReportDetailType.table;
    headers: string[];
    data: Record<string, string | number>[];
};
export declare type ReportText = {
    type: ReportDetailType.text;
    text: string;
};
export declare enum ReportDetailType {
    table = "table",
    text = "text"
}
//# sourceMappingURL=ReporterData.d.ts.map