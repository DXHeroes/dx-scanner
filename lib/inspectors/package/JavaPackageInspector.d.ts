import { PackageInspectorBase } from './PackageInspectorBase';
import { IFileInspector } from '../IFileInspector';
export declare class JavaPackageInspector extends PackageInspectorBase {
    private fileInspector;
    private parsedDependencies;
    constructor(fileInspector: IFileInspector);
    init(): Promise<void>;
    hasLockfile(): boolean;
    private addPackages;
    private resolveMavenFileString;
    private resolveGradleFileString;
}
export interface PomXML {
    project: {
        $: {
            xmlns: string;
            'xmlns:xsi': string;
            'xsi:schemaLocation': string;
        };
        modelVersion: string;
        parent: Record<string, unknown>;
        groupId: string;
        artifactId: string;
        version: string;
        name: string;
        description: string;
        properties: Record<string, unknown>;
        dependencies: [
            {
                dependency: [
                    {
                        groupId: [string];
                        artifactId: [string];
                        version: [string];
                        scope?: [string];
                        exclusions?: [string];
                    }
                ];
            }
        ];
        build: [
            {
                plugins: [
                    {
                        plugin: [
                            {
                                groupId: [string];
                                artifactId: [string];
                            }
                        ];
                    }
                ];
            }
        ];
    };
}
export interface BuildGradle {
    plugins: [];
    group: string;
    version: string;
    sourceCompatibility: string;
    repositories: [];
    dependencies: [
        {
            group: string;
            name: string;
            version: string;
            type: string;
            excludes: [];
        }
    ];
}
//# sourceMappingURL=JavaPackageInspector.d.ts.map