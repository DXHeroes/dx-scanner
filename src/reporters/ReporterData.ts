import { table as tableLib, getBorderCharacters, TableUserConfig } from 'table';

export class ReporterData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static table = (headers: string[], data: Record<string, any>[], userConfig?: TableUserConfig | undefined): string => {
    const tableData = data.map(Object.values);

    tableData.unshift(headers);
    return tableLib(tableData, { ...{ border: getBorderCharacters('norc'), singleLine: true }, ...userConfig });
  };
}

export type ReportTable = {
  type: ReportDetailType.table;
  headers: string[];
  data: Record<string, string | number>[];
};

export type ReportText = {
  type: ReportDetailType.text;
  text: string;
};

export enum ReportDetailType {
  table = 'table',
  text = 'text',
}
