import { table as tableLib, getBorderCharacters, TableUserConfig } from 'table';

export class ReporterData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static table = (data: any[], userConfig?: TableUserConfig | undefined): string => {
    return tableLib(data, { ...{ border: getBorderCharacters('norc') }, ...userConfig });
  };
}

export type ReportTable = {
  headers: string[];
  data: Record<string, string | number>[];
};

export type ReportText = {
  text: string;
};
