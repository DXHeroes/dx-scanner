"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const path_1 = __importDefault(require("path"));
const ReporterUtils_1 = require("./ReporterUtils");
const PracticeWithContextFactory_1 = require("../test/factories/PracticeWithContextFactory");
const IScanningStrategy_1 = require("../detectors/IScanningStrategy");
describe('ReporterUtils', () => {
    const practicingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory();
    const notPracticingHighImpactPracticeWithCtx = PracticeWithContextFactory_1.practiceWithContextFactory({ evaluation: model_1.PracticeEvaluationResult.notPracticing });
    const scanningStrategy = {
        accessType: IScanningStrategy_1.AccessType.public,
        localPath: path_1.default.resolve('./'),
        rootPath: undefined,
        remoteUrl: 'https://github.com/DXHeroes/dx-scanner',
        isOnline: true,
        serviceType: IScanningStrategy_1.ServiceType.github,
    };
    describe('#computeDXScore', () => {
        it('one practicing practice', () => {
            const result = ReporterUtils_1.ReporterUtils.computeDXScore([practicingHighImpactPracticeWithCtx], scanningStrategy);
            expect(result.points.max).toEqual(100);
            expect(result.points.total).toEqual(100);
            expect(result.points.percentage).toEqual(100);
            expect(result.value).toEqual('100% | 1/1');
        });
        it('one practicing practice and one not practicing', () => {
            const result = ReporterUtils_1.ReporterUtils.computeDXScore([practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx], scanningStrategy);
            expect(result.points.max).toEqual(200);
            expect(result.points.total).toEqual(100);
            expect(result.points.percentage).toEqual(50);
            expect(result.value).toEqual('50% | 1/2');
        });
        it('one practicing practice and one skipped practicing', () => {
            notPracticingHighImpactPracticeWithCtx.overridenImpact = model_1.PracticeImpact.off;
            notPracticingHighImpactPracticeWithCtx.isOn = false;
            const result = ReporterUtils_1.ReporterUtils.computeDXScore([practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx], scanningStrategy);
            expect(result.points.max).toEqual(100);
            expect(result.points.total).toEqual(100);
            expect(result.points.percentage).toEqual(100);
            expect(result.value).toEqual('100% | 1/1 (1 skipped)');
        });
        it('one skipped practice', () => {
            notPracticingHighImpactPracticeWithCtx.overridenImpact = model_1.PracticeImpact.off;
            notPracticingHighImpactPracticeWithCtx.isOn = false;
            const result = ReporterUtils_1.ReporterUtils.computeDXScore([notPracticingHighImpactPracticeWithCtx], scanningStrategy);
            expect(result.points.max).toEqual(0);
            expect(result.points.total).toEqual(0);
            expect(result.points.percentage).toEqual(0);
            expect(result.value).toEqual('0% | 0/0 (1 skipped)');
        });
    });
    describe('#getComponentsWithPractices', () => {
        it('returns one component with one practiceWithContext', () => {
            const result = ReporterUtils_1.ReporterUtils.getComponentsWithPractices([practicingHighImpactPracticeWithCtx], scanningStrategy);
            expect(result.length).toEqual(1);
            expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
            expect(result[0].practicesAndComponents.length).toEqual(1);
            expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);
        });
        it('returns one component with two practiceWithContext', () => {
            const result = ReporterUtils_1.ReporterUtils.getComponentsWithPractices([practicingHighImpactPracticeWithCtx, practicingHighImpactPracticeWithCtx], scanningStrategy);
            expect(result.length).toEqual(1);
            expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
            expect(result[0].practicesAndComponents.length).toEqual(2);
            expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);
            expect(result[0].practicesAndComponents[1]).toEqual(practicingHighImpactPracticeWithCtx);
        });
        it('returns two components on different path with one practiceWithContext each', () => {
            const mockPracticeWithContext1st = PracticeWithContextFactory_1.practiceWithContextFactory({
                component: { repositoryPath: 'https://github.com/dxheroes/dx-scanner', path: './1stService' },
            });
            const mockPracticeWithContext2nd = PracticeWithContextFactory_1.practiceWithContextFactory({
                component: { repositoryPath: 'https://github.com/dxheroes/dx-scanner', path: './2ndService' },
            });
            const result = ReporterUtils_1.ReporterUtils.getComponentsWithPractices([mockPracticeWithContext1st, mockPracticeWithContext2nd], scanningStrategy);
            expect(result.length).toEqual(2);
            expect(result[0].component).toEqual({
                repositoryPath: 'https://github.com/dxheroes/dx-scanner/tree/master/1stService',
                path: './1stService',
                language: model_1.ProgrammingLanguage.JavaScript,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
                type: model_1.ProjectComponentType.UNKNOWN,
                platform: model_1.ProjectComponentPlatform.UNKNOWN,
            });
            expect(result[0].practicesAndComponents.length).toEqual(1);
            expect(result[0].practicesAndComponents[0]).toEqual(mockPracticeWithContext1st);
            expect(result[1].component).toEqual({
                repositoryPath: 'https://github.com/dxheroes/dx-scanner/tree/master/2ndService',
                path: './2ndService',
                language: model_1.ProgrammingLanguage.JavaScript,
                framework: model_1.ProjectComponentFramework.UNKNOWN,
                type: model_1.ProjectComponentType.UNKNOWN,
                platform: model_1.ProjectComponentPlatform.UNKNOWN,
            });
            expect(result[1].practicesAndComponents.length).toEqual(1);
            expect(result[1].practicesAndComponents[0]).toEqual(mockPracticeWithContext2nd);
        });
        it('returns component with Github strategy and correct repositoryPath and path', () => {
            const scStr = {
                accessType: IScanningStrategy_1.AccessType.private,
                localPath: 'myApp',
                rootPath: undefined,
                remoteUrl: 'https://user:password@github.com/DXHeroes/dx-scanner.git',
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            };
            const practiceWithContext = PracticeWithContextFactory_1.practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
            const result = ReporterUtils_1.ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);
            expect(result.length).toEqual(1);
            expect(result[0].component).toEqual(Object.assign(Object.assign({}, practiceWithContext.component), { repositoryPath: 'https://github.com/DXHeroes/dx-scanner/tree/master/myApp' }));
            expect(result[0].practicesAndComponents.length).toEqual(1);
            expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
        });
        it('returns component with GitLab strategy and correct repositoryPath and path', () => {
            const scStr = {
                accessType: IScanningStrategy_1.AccessType.private,
                localPath: 'myApp',
                rootPath: undefined,
                remoteUrl: 'https://user:password@gitlab.com/DXHeroes/dx-scanner.git',
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.gitlab,
            };
            const practiceWithContext = PracticeWithContextFactory_1.practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
            const result = ReporterUtils_1.ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);
            expect(result.length).toEqual(1);
            expect(result[0].component).toEqual(Object.assign(Object.assign({}, practiceWithContext.component), { repositoryPath: 'https://gitlab.com/DXHeroes/dx-scanner/tree/master/myApp' }));
            expect(result[0].practicesAndComponents.length).toEqual(1);
            expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
        });
        it('returns component with Bitbucket strategy and correct repositoryPath and path', () => {
            const scStr = {
                accessType: IScanningStrategy_1.AccessType.private,
                localPath: 'myApp',
                rootPath: undefined,
                remoteUrl: 'https://user:password@bitbucket.org/DXHeroes/dx-scanner.git',
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.bitbucket,
            };
            const practiceWithContext = PracticeWithContextFactory_1.practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
            const result = ReporterUtils_1.ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);
            expect(result.length).toEqual(1);
            expect(result[0].component).toEqual(Object.assign(Object.assign({}, practiceWithContext.component), { repositoryPath: 'https://bitbucket.org/DXHeroes/dx-scanner/src/master/myApp' }));
            expect(result[0].practicesAndComponents.length).toEqual(1);
            expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
        });
        it('returns component with local strategy and correct repositoryPath and path', () => {
            const scStr = {
                accessType: IScanningStrategy_1.AccessType.private,
                localPath: 'myApp',
                rootPath: undefined,
                remoteUrl: undefined,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.local,
            };
            const practiceWithContext = PracticeWithContextFactory_1.practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
            const result = ReporterUtils_1.ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);
            expect(result.length).toEqual(1);
            expect(result[0].component).toEqual(practiceWithContext.component);
            expect(result[0].practicesAndComponents.length).toEqual(1);
            expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
        });
    });
});
//# sourceMappingURL=ReporterUtils.spec.js.map