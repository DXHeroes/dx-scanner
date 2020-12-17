export interface IOutput {
    info(message?: any, ...params: any[]): void;
    warning(message?: any, ...params: any[]): void;
    error(message?: any, ...params: any[]): void;
    taskStart(message?: any, ...params: any[]): void;
    completed(message?: any, ...params: any[]): void;
}
export declare class ConsoleOutput implements IOutput {
    taskStart(message?: any, ...params: any[]): any;
    warning(message?: any, ...params: any[]): any;
    error(message?: any, ...params: any[]): any;
    completed(message?: any, ...params: any[]): any;
    info(message?: any, ...params: any[]): any;
}
//# sourceMappingURL=output.d.ts.map