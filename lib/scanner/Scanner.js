"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const cli_ux_1 = require("cli-ux");
const fs_1 = __importDefault(require("fs"));
const inversify_1 = require("inversify");
const lodash_1 = __importDefault(require("lodash"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("simple-git/promise"));
const git_url_parse_1 = __importDefault(require("git-url-parse"));
const url_1 = __importDefault(require("url"));
const util_1 = require("util");
const IScanningStrategy_1 = require("../detectors/IScanningStrategy");
const utils_1 = require("../detectors/utils");
const errors_1 = require("../lib/errors");
const model_1 = require("../model");
const ScannerUtils_1 = require("../scanner/ScannerUtils");
const services_1 = require("../services");
const types_1 = require("../types");
const ScanningStrategyExplorer_1 = require("./ScanningStrategyExplorer");
let Scanner = class Scanner {
    constructor(scanStrategyExplorer, discoveryContextFactory, fileSystemService, 
    // inject all practices registered under Types.Practice in inversify config
    practices, argumentsProvider) {
        this.shouldExitOnEnd = false;
        this.scanStrategyExplorer = scanStrategyExplorer;
        this.discoveryContextFactory = discoveryContextFactory;
        this.fileSystemService = fileSystemService;
        this.practices = practices;
        this.argumentsProvider = argumentsProvider;
        this.d = utils_1.debugLog('scanner');
        this.allDetectedComponents = undefined;
    }
    async scan({ determineRemote } = { determineRemote: true }) {
        const repositoryConfig = await this.scanStrategyExplorer.explore();
        this.d(`Resitory Config: ${util_1.inspect(repositoryConfig)}`);
        const discoveryContext = this.discoveryContextFactory(repositoryConfig);
        let scanStrategy = await discoveryContext.scanningStrategyDetector.detect();
        this.d(`Scan stgy: ${util_1.inspect(scanStrategy)}`);
        this.d(`Scan strategy detected: ${util_1.inspect(scanStrategy)}`);
        if (determineRemote && (scanStrategy.serviceType === undefined || scanStrategy.accessType === IScanningStrategy_1.AccessType.unknown)) {
            return {
                shouldExitOnEnd: this.shouldExitOnEnd,
                needsAuth: true,
                serviceType: scanStrategy.serviceType,
                isOnline: scanStrategy.isOnline,
            };
        }
        const isLocal = !scanStrategy.localPath;
        scanStrategy = await this.preprocessData(scanStrategy);
        console.error(process.env.PWD);
        console.error(process.cwd());
        console.error('TEST LOG');
        this.d(`Scan strategy (after preprocessing): ${util_1.inspect(scanStrategy)}`);
        const scannerContext = discoveryContext.getScanningContext(scanStrategy);
        const languagesAtPaths = await this.detectLanguagesAtPaths(scannerContext);
        if (!languagesAtPaths.length) {
            cli_ux_1.cli.warn('No language was detected. Score will be 0%.');
        }
        this.d(`LanguagesAtPaths (${languagesAtPaths.length}):`, util_1.inspect(languagesAtPaths));
        const projectComponents = await this.detectProjectComponents(languagesAtPaths, scannerContext, scanStrategy);
        this.d(`Components (${projectComponents.length}):`, util_1.inspect(projectComponents));
        const practicesWithContext = await this.detectPractices(projectComponents);
        this.d(`Practices (${practicesWithContext.length}):`, util_1.inspect(practicesWithContext));
        let practicesAfterFix;
        if (this.argumentsProvider.fix) {
            if (isLocal) {
                cli_ux_1.cli.warn('`fix` command only works for local folder, not for online repositories');
            }
            else {
                await this.fix(practicesWithContext);
                practicesAfterFix = await this.detectPractices(projectComponents);
            }
        }
        await this.report(scannerContext.reporters, practicesWithContext, practicesAfterFix);
        this.d(`Overall scan stats. LanguagesAtPaths: ${util_1.inspect(languagesAtPaths.length)}; Components: ${util_1.inspect(this.allDetectedComponents.length)}; Practices: ${util_1.inspect(practicesWithContext.length)}.`);
        if (practicesWithContext.length > 0 && practicesWithContext[0].componentContext.configProvider.config)
            utils_1.debugLog('config')('Project configuration: \n' + util_1.inspect(practicesWithContext[0].componentContext.configProvider.config));
        else
            utils_1.debugLog('config')('No project configuration found');
        return { shouldExitOnEnd: this.shouldExitOnEnd };
    }
    /**
     * Initialize Scanner configuration
     */
    async init(scanPath) {
        const filePath = scanPath + '.dxscannerrc';
        cli_ux_1.cli.action.start(`Initializing configuration: ${filePath}.yaml`);
        // check if .dxscannerrc.yaml already exists
        const fileExists = await this.fileSystemService.exists(`${filePath}`);
        const yamlExists = await this.fileSystemService.exists(`${filePath}.yaml`);
        const ymlExists = await this.fileSystemService.exists(`${filePath}.yml`);
        const jsonExists = await this.fileSystemService.exists(`${filePath}.json`);
        if (!yamlExists && !fileExists && !ymlExists && !jsonExists) {
            await this.createConfiguration(filePath);
        }
        else {
            cli_ux_1.cli.warn('You already have a dx-scanner config.');
        }
        cli_ux_1.cli.action.stop();
    }
    async fix(practicesWithContext, scanningStrategy) {
        if (!this.argumentsProvider.fix)
            return;
        const fixablePractice = (p) => p.practice.fix && p.evaluation === model_1.PracticeEvaluationResult.notPracticing;
        const fixPatternMatcher = this.argumentsProvider.fixPattern ? new RegExp(this.argumentsProvider.fixPattern, 'i') : null;
        const shouldFix = (p) => {
            const fixFromCli = fixPatternMatcher ? fixPatternMatcher.test(p.practice.getMetadata().id) : undefined;
            const practiceConfig = p.componentContext.configProvider.getOverriddenPractice(p.practice.getMetadata().id);
            const fixFromConfig = practiceConfig === null || practiceConfig === void 0 ? void 0 : practiceConfig.fix;
            return fixFromCli !== undefined ? fixFromCli : fixFromConfig !== undefined ? fixFromConfig : true;
        };
        await Promise.all(practicesWithContext
            .filter(fixablePractice)
            .filter(shouldFix)
            .map((p) => p.practice.fix(Object.assign(Object.assign({}, p.practiceContext), { scanningStrategy, config: p.componentContext.configProvider.getOverriddenPractice(p.practice.getMetadata().id), argumentsProvider: this.argumentsProvider }))));
    }
    /**
     * Clone a repository if the input is remote repository
     */
    async preprocessData(scanningStrategy) {
        var _a;
        const { serviceType, accessType, remoteUrl, rootPath, isOnline } = scanningStrategy;
        let { localPath } = scanningStrategy;
        if (!isOnline) {
            return { serviceType, accessType, remoteUrl, localPath, rootPath, isOnline };
        }
        if (localPath === undefined && remoteUrl !== undefined && serviceType !== IScanningStrategy_1.ServiceType.local) {
            const cloneUrl = new url_1.default.URL(remoteUrl);
            localPath = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), 'dx-scanner'));
            if ((_a = this.argumentsProvider.auth) === null || _a === void 0 ? void 0 : _a.includes(':')) {
                cloneUrl.username = this.argumentsProvider.auth.split(':')[0];
                cloneUrl.password = this.argumentsProvider.auth.split(':')[1];
            }
            else if (this.argumentsProvider.auth) {
                cloneUrl.password = this.argumentsProvider.auth;
                if (serviceType === IScanningStrategy_1.ServiceType.gitlab) {
                    cloneUrl.username = 'private-token';
                }
                if (serviceType === IScanningStrategy_1.ServiceType.github) {
                    cloneUrl.username = 'access-token';
                }
                if (serviceType === IScanningStrategy_1.ServiceType.bitbucket) {
                    cloneUrl.username = git_url_parse_1.default(this.argumentsProvider.uri).owner;
                }
            }
            await promise_1.default().silent(true).clone(cloneUrl.href, localPath, { '--depth': '100' });
        }
        return { serviceType, accessType, remoteUrl, localPath, rootPath: rootPath || localPath, isOnline };
    }
    /**
     * Detect all languages
     */
    async detectLanguagesAtPaths(context) {
        let languagesAtPaths = [];
        const languageDetectors = await Promise.all(context.languageDetectors.map((languageDetector) => languageDetector.detectLanguage()));
        for (const languageDetector of languageDetectors) {
            languagesAtPaths = [...languagesAtPaths, ...languageDetector];
        }
        return languagesAtPaths;
    }
    /**
     * Detect project components (backend, frontend, libraries, etc.)
     */
    async detectProjectComponents(languagesAtPaths, context, strategy) {
        let components = [];
        for (const langAtPath of languagesAtPaths) {
            const langContext = context.getLanguageContext(langAtPath);
            await langContext.init();
            const detectors = langContext.getProjectComponentDetectors();
            for (const componentDetector of detectors) {
                const componentsWithContext = (await componentDetector.detectComponent(langAtPath)).map((c) => {
                    if (strategy.remoteUrl) {
                        c.repositoryPath = strategy.remoteUrl;
                    }
                    return {
                        component: c,
                        languageContext: langContext,
                    };
                });
                // Add an unknown component for the language at path if we could not detect particular component
                if (langAtPath && componentsWithContext.length === 0) {
                    components = [
                        ...components,
                        {
                            languageContext: langContext,
                            component: {
                                framework: model_1.ProjectComponentFramework.UNKNOWN,
                                language: langContext.language,
                                path: langAtPath.path,
                                platform: model_1.ProjectComponentPlatform.UNKNOWN,
                                type: model_1.ProjectComponentType.UNKNOWN,
                                repositoryPath: undefined,
                            },
                        },
                    ];
                }
                else {
                    components = [...components, ...componentsWithContext];
                }
            }
        }
        this.allDetectedComponents = components;
        return await this.getRelevantComponents(components);
    }
    /**
     * Detect applicable practices for each component
     */
    async detectPractices(componentsWithContext) {
        const practicesWithComponentContext = await Promise.all(componentsWithContext.map(async (cwctx) => await this.detectPracticesForComponent(cwctx)));
        const practicesWithContext = lodash_1.default.flatten(practicesWithComponentContext);
        this.d('Applicable practices:');
        this.d(practicesWithContext.map((p) => p.practice.getMetadata().name));
        return practicesWithContext;
    }
    /**
     * Report result with specific reporter
     */
    async report(reporters, practicesWithContext, practicesWithContextAfterFix) {
        const pwcForReporter = (p) => {
            const config = p.componentContext.configProvider.getOverriddenPractice(p.practice.getMetadata().id);
            const overridenImpact = config === null || config === void 0 ? void 0 : config.impact;
            return {
                component: p.componentContext.projectComponent,
                practice: Object.assign(Object.assign({}, p.practice.getMetadata()), { data: p.practice.data, fix: Boolean(p.practice.fix) }),
                evaluation: p.evaluation,
                evaluationError: p.evaluationError,
                overridenImpact: (overridenImpact || p.practice.getMetadata().impact),
                isOn: p.isOn,
            };
        };
        const relevantPractices = practicesWithContext.map(pwcForReporter);
        this.d(`Reporters length: ${reporters.length}`);
        if (practicesWithContextAfterFix) {
            const relevantPracticesAfterFix = practicesWithContextAfterFix.map(pwcForReporter);
            await Promise.all(reporters.map((r) => r.report(relevantPractices, relevantPracticesAfterFix)));
        }
        else {
            await Promise.all(reporters.map(async (r) => await r.report(relevantPractices)));
        }
        if (this.allDetectedComponents.length > 1 && !this.argumentsProvider.recursive) {
            cli_ux_1.cli.info(`Found more than 1 component. To scan all ${this.allDetectedComponents.length} components run the scanner with an argument --recursive\n`);
        }
        const notPracticingPracticesToFail = ScannerUtils_1.ScannerUtils.filterNotPracticingPracticesToFail(relevantPractices, this.argumentsProvider);
        if (notPracticingPracticesToFail.length > 0) {
            this.shouldExitOnEnd = true;
        }
    }
    /**
     * Detect and evaluate applicable practices for a given component
     */
    async detectPracticesForComponent(componentWithCtx) {
        const practicesWithContext = [];
        const componentContext = componentWithCtx.languageContext.getProjectComponentContext(componentWithCtx.component);
        const practiceContext = componentContext.getPracticeContext();
        await componentContext.configProvider.init();
        const filteredPractices = await ScannerUtils_1.ScannerUtils.filterPractices(componentContext, this.practices);
        const orderedApplicablePractices = ScannerUtils_1.ScannerUtils.sortPractices(filteredPractices.customApplicablePractices);
        /**
         * Evaluate practices in correct order
         */
        for (const practice of orderedApplicablePractices) {
            const practiceConfig = componentContext.configProvider.getOverriddenPractice(practice.getMetadata().id);
            const isFulfilled = ScannerUtils_1.ScannerUtils.isFulfilled(practice, practicesWithContext);
            if (!isFulfilled)
                continue;
            let evaluation = model_1.PracticeEvaluationResult.unknown;
            let evaluationError;
            try {
                evaluation = await practice.evaluate(Object.assign(Object.assign({}, practiceContext), { config: practiceConfig }));
            }
            catch (error) {
                evaluationError = error.toString();
                const practiceDebug = utils_1.debugLog('practices');
                practiceDebug(`The ${practice.getMetadata().name} practice failed with this error:\n${error.stack}`);
            }
            const practiceWithContext = {
                practice,
                componentContext,
                practiceContext,
                evaluation,
                evaluationError,
                isOn: true,
            };
            practicesWithContext.push(practiceWithContext);
        }
        /**
         * Add turned off practices to result
         */
        for (const practice of filteredPractices.practicesOff) {
            const practiceWithContext = {
                practice,
                componentContext,
                practiceContext,
                evaluation: model_1.PracticeEvaluationResult.unknown,
                evaluationError: undefined,
                isOn: false,
            };
            practicesWithContext.push(practiceWithContext);
        }
        return practicesWithContext;
    }
    /**
     * Get all relevant components.
     */
    async getRelevantComponents(componentsWithContext) {
        let relevantComponents = componentsWithContext;
        if (!this.argumentsProvider.recursive && relevantComponents.length > 1) {
            const componentsSharedPath = utils_1.sharedSubpath(relevantComponents.map((cwc) => cwc.component.path));
            const componentsAtRootPath = relevantComponents.filter((cwc) => cwc.component.path === componentsSharedPath);
            // scan the first component only if recursion flag is not true && there are more than 1 components on root
            relevantComponents = [relevantComponents[0]];
            // do not scan only root path if found 0 components there
            if (componentsAtRootPath.length > 0) {
                relevantComponents = componentsAtRootPath;
            }
        }
        return relevantComponents;
    }
    async createConfiguration(filePath) {
        let yamlInitContent = `# practices:`;
        // get Metadata and sort it alphabetically using id
        for (const practice of this.listPractices()) {
            const dataObject = practice.getMetadata();
            yamlInitContent += `\n#    ${dataObject.id}: ${dataObject.impact}`;
        }
        try {
            await this.fileSystemService.writeFile(`${filePath}.yaml`, yamlInitContent);
        }
        catch (err) {
            throw errors_1.ErrorFactory.newInternalError(`Error during configuration file initialization: ${err.message}`);
        }
    }
    listPractices() {
        return ScannerUtils_1.ScannerUtils.sortAlphabetically(this.practices);
    }
};
Scanner = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ScanningStrategyExplorer_1.ScanningStrategyExplorer)),
    __param(1, inversify_1.inject(types_1.Types.DiscoveryContextFactory)),
    __param(2, inversify_1.inject(services_1.FileSystemService)),
    __param(3, inversify_1.multiInject(types_1.Types.Practice)),
    __param(4, inversify_1.inject(types_1.Types.ArgumentsProvider)),
    __metadata("design:paramtypes", [ScanningStrategyExplorer_1.ScanningStrategyExplorer, Function, services_1.FileSystemService, Array, Object])
], Scanner);
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map