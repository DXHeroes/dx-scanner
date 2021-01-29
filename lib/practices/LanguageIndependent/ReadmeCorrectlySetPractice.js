"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadmeIsCorrectlySet = void 0;
const model_1 = require("../../model");
const DxPracticeDecorator_1 = require("../DxPracticeDecorator");
const PracticeBase_1 = require("../PracticeBase");
const ReporterData_1 = require("../../reporters/ReporterData");
let ReadmeIsCorrectlySet = class ReadmeIsCorrectlySet extends PracticeBase_1.PracticeBase {
    parseReadme(readmeFile) {
        return readmeFile
            .toString()
            .split(/\r?\n/)
            .filter((content) => content.trim() !== '');
    }
    async isApplicable() {
        return true;
    }
    async evaluate(ctx) {
        if (!ctx.root.fileInspector) {
            return model_1.PracticeEvaluationResult.unknown;
        }
        const regexReadme = new RegExp('readme', 'i');
        const rootFiles = await ctx.root.fileInspector.scanFor(regexReadme, '/', { shallow: true });
        const filePath = rootFiles[0].path;
        const content = await ctx.root.fileInspector.readFile(filePath);
        const parsedReadme = this.parseReadme(content);
        const heading = parsedReadme.filter((value) => /^(?:<h1>|#[^#])/.test(value)).length;
        const gettingStarted = parsedReadme.find((value) => /^(?:<h[2-6]>|#{2}).*(Getting\s+Started)/i.test(value));
        const prerequisites = parsedReadme.find((value) => /^(?:<h[2-6]>|#{2}).*(Prerequisites)/i.test(value));
        const install = parsedReadme.find((value) => /^(?:<h[2-6]>|#{2}).*(Install)(?:ing|ation)/i.test(value));
        const contribute = parsedReadme.find((value) => /^(?:<h[2-6]>|#{2}).*(Contribut)(?:ing|ion)/i.test(value));
        const license = parsedReadme.find((value) => /^(?:<h[2-6]>|#{2}).*(License)/i.test(value));
        if (heading === 1 && gettingStarted && prerequisites && install && contribute && license) {
            return model_1.PracticeEvaluationResult.practicing;
        }
        this.setData();
        return model_1.PracticeEvaluationResult.notPracticing;
    }
    setData() {
        this.data.details = [
            {
                type: ReporterData_1.ReportDetailType.text,
                text: 'You should have a single h1, getting started (h2), prerequisites(h3), installation(h3), contributing(h2) and license(h2) sections in readme.',
            },
        ];
    }
};
ReadmeIsCorrectlySet = __decorate([
    DxPracticeDecorator_1.DxPractice({
        id: 'LanguageIndependent.ReadmeCorrectlySet',
        name: 'Set README.md Correctly',
        impact: model_1.PracticeImpact.high,
        suggestion: 'Provide necessary sections in README',
        reportOnlyOnce: false,
        url: 'https://developerexperience.io/practices/readme',
        dependsOn: { practicing: ['LanguageIndependent.ReadmeIsPresent'] },
    })
], ReadmeIsCorrectlySet);
exports.ReadmeIsCorrectlySet = ReadmeIsCorrectlySet;
//# sourceMappingURL=ReadmeCorrectlySetPractice.js.map