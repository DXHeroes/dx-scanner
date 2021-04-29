import 'reflect-metadata';
declare class DXScannerCommand {
    static run(): Promise<void>;
    private static validateFailInput;
    private static notifyUpdate;
}
export default DXScannerCommand;
export { ServiceCollectorsData as CollectorsData } from './collectors/ServiceDataCollector';
export { ServiceType } from './detectors';
export { ProgrammingLanguage, ProjectComponent, ProjectComponentFramework, ProjectComponentPlatform, ProjectComponentType } from './model';
export * from './reporters/DashboardReporter';
//# sourceMappingURL=index.d.ts.map