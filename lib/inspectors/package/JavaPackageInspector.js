"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaPackageInspector = void 0;
const PackageInspectorBase_1 = require("./PackageInspectorBase");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const IPackageInspector_1 = require("../IPackageInspector");
const xml2js = __importStar(require("xml2js"));
const g2js = __importStar(require("gradle-to-js"));
const ErrorFactory_1 = require("../../lib/errors/ErrorFactory");
let JavaPackageInspector = class JavaPackageInspector extends PackageInspectorBase_1.PackageInspectorBase {
    constructor(fileInspector) {
        super();
        this.parsedDependencies = [];
        this.fileInspector = fileInspector;
    }
    async init() {
        try {
            this.debug('JavaPackageInspector init started');
            this.packages = [];
            const isMaven = await this.fileInspector.exists('pom.xml');
            if (isMaven) {
                const mavenFileString = await this.fileInspector.readFile('pom.xml');
                await this.resolveMavenFileString(mavenFileString);
            }
            else {
                const isGradle = await this.fileInspector.exists('build.gradle');
                let isGradleKts = false;
                if (!isGradle) {
                    if (await this.fileInspector.exists('build.gradle.kts')) {
                        isGradleKts = true;
                    }
                    else {
                        throw ErrorFactory_1.ErrorFactory.newInternalError('Unsupported Java project architecture');
                    }
                }
                const gradleFileString = isGradleKts
                    ? await this.fileInspector.readFile('build.gradle.kts')
                    : await this.fileInspector.readFile('build.gradle');
                await this.resolveGradleFileString(gradleFileString);
            }
            this.addPackages(this.parsedDependencies, IPackageInspector_1.DependencyType.Runtime);
            this.debug('JavaPackageInspector init ended');
        }
        catch (e) {
            this.packages = undefined;
            this.debug(e);
        }
    }
    hasLockfile() {
        return false;
    }
    addPackages(dependencies, depType) {
        if (!dependencies) {
            return;
        }
        if (!this.packages) {
            this.packages = [];
        }
        for (const dependency of dependencies) {
            let parsedVersion = {
                value: '',
                major: '',
                minor: '',
                patch: '',
            };
            if (dependency.version) {
                parsedVersion = PackageInspectorBase_1.PackageInspectorBase.semverToPackageVersion(dependency.version);
            }
            if (parsedVersion) {
                this.packages.push({
                    dependencyType: depType,
                    name: dependency.packageName,
                    requestedVersion: parsedVersion,
                    lockfileVersion: parsedVersion,
                });
            }
        }
    }
    async resolveMavenFileString(mavenFileString) {
        xml2js.parseString(mavenFileString, (err, result) => {
            if (err) {
                throw ErrorFactory_1.ErrorFactory.newInternalError(`xml2js failed to parse pom.xml: ${err.message}`);
            }
            const xmlDependencies = result.project.dependencies.values();
            for (const xmlDependency of xmlDependencies) {
                const dependencyAttributes = xmlDependency.dependency.values();
                for (const attribute of dependencyAttributes) {
                    const packageName = `${attribute.groupId.pop()}:${attribute.artifactId.pop()}`;
                    const version = attribute.version ? String(attribute.version.pop()) : undefined;
                    this.parsedDependencies.push({ packageName, version });
                }
            }
        });
    }
    async resolveGradleFileString(gradleFileString) {
        await g2js.parseText(gradleFileString).then((result) => {
            for (const dependency of result.dependencies) {
                if (dependency.name.startsWith("'") && dependency.name.endsWith("'")) {
                    dependency.name = dependency.name.slice(1, -1);
                }
                const version = dependency.version ? dependency.version : undefined;
                this.parsedDependencies.push({ packageName: dependency.name, version });
            }
        });
    }
};
JavaPackageInspector = __decorate([
    __param(0, inversify_1.inject(types_1.Types.IFileInspector)),
    __metadata("design:paramtypes", [Object])
], JavaPackageInspector);
exports.JavaPackageInspector = JavaPackageInspector;
//# sourceMappingURL=JavaPackageInspector.js.map