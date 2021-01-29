import 'reflect-metadata';
declare class DXScannerCommand {
    static run(): Promise<void>;
    private static validateFailInput;
    private static notifyUpdate;
}
export default DXScannerCommand;
export * from './reporters/DashboardReporter';
export { ServiceType } from './detectors';
export { CollectorsData } from './collectors/DataCollector';
export { ProgrammingLanguage, ProjectComponent, ProjectComponentPlatform, ProjectComponentFramework, ProjectComponentType } from './model';
//# sourceMappingURL=index.d.ts.map