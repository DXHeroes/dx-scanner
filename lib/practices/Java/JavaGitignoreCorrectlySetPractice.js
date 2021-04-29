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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaGitignoreCorrectlySetPractice = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const GitignoreCorrectlySetPracticeBase_1 = require("../common/GitignoreCorrectlySetPracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
let JavaGitignoreCorrectlySetPractice = class JavaGitignoreCorrectlySetPractice extends GitignoreCorrectlySetPracticeBase_1.GitignoreCorrectlySetPracticeBase {
    constructor() {
        const checkArch = (arch, regex, fix) => (ctx, v) => {
            if (this.javaArchitecture !== arch || regex.test(v)) {
                return undefined;
            }
            else {
                return fix;
            }
        };
        super();
        this.applicableLanguages = [model_1.ProgrammingLanguage.Java, model_1.ProgrammingLanguage.Kotlin];
        this.ruleChecks = [
            // common
            { regex: /\*\.class/, fix: '*.class' },
            { regex: /\*\.war/, fix: '*.war' },
            { regex: /\*\.jar/, fix: '*.jar' },
            { regex: /\*\.log/, fix: '*.log' },
            // maven
            { check: checkArch('Maven', /\.mvn/, '*.mvn') },
            { check: checkArch('Maven', /buildNumber\.properties/, 'buildNumber.properties') },
            { check: checkArch('Maven', /target/, 'target/') },
            { check: checkArch('Maven', /pom\.xml\.tag/, 'pom.xml.tag') },
            { check: checkArch('Maven', /pom\.xml\.next/, 'pom.xml.next') },
            { check: checkArch('Maven', /release\.properties/, 'release.properties') },
            // gradle
            { check: checkArch('Gradle', /\.gradle/, '*.gradle') },
            { check: checkArch('Gradle', /gradle-app\.setting/, 'gradle-app.setting') },
            { check: checkArch('Gradle', /!gradle-wrapper\.jar/, '!gradle-wrapper.jar') },
            { check: checkArch('Gradle', /\.gradletasknamecache/, '.gradletasknamecache') },
        ];
    }
    async evaluate(ctx) {
        const fileInspector = await GitignoreCorrectlySetPracticeBase_1.GitignoreCorrectlySetPracticeBase.checkFileInspector(ctx);
        if (!fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        if (await fileInspector.exists('pom.xml')) {
            this.javaArchitecture = 'Maven';
        }
        else if ((await fileInspector.exists('build.gradle')) || (await fileInspector.exists('build.gradle.kts'))) {
            this.javaArchitecture = 'Gradle';
        }
        return super.evaluate(ctx);
    }
    setData() {
        this.data.details = [
            {
                type: ReporterData_1.ReportDetailType.text,
                text: 'You should ignore generated java artifacts (.class, .jar, .war) and maven- or gradle-specific files.',
            },
        ];
    }
};
JavaGitignoreCorrectlySetPractice = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'Java.GitignoreCorrectlySet',
        name: 'Set .gitignore Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Set patterns in the .gitignore as usual.',
        reportOnlyOnce: true,
        url: 'https://github.com/github/gitignore/blob/master/Java.gitignore',
        dependsOn: { practicing: ['LanguageIndependent.GitignoreIsPresent'] },
    }),
    __metadata("design:paramtypes", [])
], JavaGitignoreCorrectlySetPractice);
exports.JavaGitignoreCorrectlySetPractice = JavaGitignoreCorrectlySetPractice;
//# sourceMappingURL=JavaGitignoreCorrectlySetPractice.js.map