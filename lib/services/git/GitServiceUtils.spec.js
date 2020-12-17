"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScanningStrategy_mock_1 = require("../../scanner/__MOCKS__/ScanningStrategy.mock");
const GitServiceUtils_1 = require("./GitServiceUtils");
const model_1 = require("../../model");
const IScanningStrategy_1 = require("../../detectors/IScanningStrategy");
describe('GitServiceUtils', () => {
    describe('#getUrlToRepo', () => {
        it('returns url for github to root of repository', () => {
            const scanStrg = {
                accessType: IScanningStrategy_1.AccessType.public,
                localPath: '/builds/repos/myRepository',
                rootPath: '/builds/repos/myRepository',
                remoteUrl: 'https://github.com/DXHeroes/dx-scanner',
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            };
            const response = GitServiceUtils_1.GitServiceUtils.getUrlToRepo(scanStrg.remoteUrl, scanStrg, scanStrg.localPath);
            expect(response).toEqual('https://github.com/DXHeroes/dx-scanner');
        });
        it('returns url for github to path for a component in a repository', () => {
            const scanStrg = {
                accessType: IScanningStrategy_1.AccessType.public,
                localPath: '/builds/repos/myRepository/myComponent',
                rootPath: '/builds/repos/myRepository',
                remoteUrl: 'https://github.com/DXHeroes/dx-scanner',
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            };
            const response = GitServiceUtils_1.GitServiceUtils.getUrlToRepo(scanStrg.remoteUrl, scanStrg, scanStrg.localPath);
            expect(response).toEqual('https://github.com/DXHeroes/dx-scanner/tree/master/myComponent');
        });
        it('returns url for github to path for a subcomponent in a repository', () => {
            const scanStrg = {
                accessType: IScanningStrategy_1.AccessType.public,
                localPath: '/builds/repos/myRepository/myComponent/mySubcomponent',
                rootPath: '/builds/repos/myRepository',
                remoteUrl: 'https://github.com/DXHeroes/dx-scanner',
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            };
            const response = GitServiceUtils_1.GitServiceUtils.getUrlToRepo(scanStrg.remoteUrl, scanStrg, scanStrg.localPath);
            expect(response).toEqual('https://github.com/DXHeroes/dx-scanner/tree/master/myComponent/mySubcomponent');
        });
        it('returns url for github to root of repository', () => {
            const response = GitServiceUtils_1.GitServiceUtils.getUrlToRepo('https://www.github.com/DXHeroes/dx-scanner.git', ScanningStrategy_mock_1.scanningStrategy);
            expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
        });
        it('returns url to component for bitbucket', () => {
            const response = GitServiceUtils_1.GitServiceUtils.getUrlToRepo('https://www.bitbucket.com/pypy/pypy.git', Object.assign(Object.assign({}, ScanningStrategy_mock_1.scanningStrategy), { serviceType: IScanningStrategy_1.ServiceType.bitbucket }), 'component');
            expect(response).toEqual('https://www.bitbucket.com/pypy/pypy/src/master/component');
        });
    });
    it('Parses url', () => {
        const response = GitServiceUtils_1.GitServiceUtils.parseUrl('https://www.github.com/DXHeroes/dx-scanner.git');
        expect(response).toEqual({ host: 'www.github.com', owner: 'DXHeroes', repoName: 'dx-scanner', protocol: 'https' });
    });
    it('Returns repo name', () => {
        const response = GitServiceUtils_1.GitServiceUtils.getRepoName('https://www.github.com/DXHeroes/dx-scanner.git', '../dx-scanner');
        expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
    });
    it('Returns local path to repo', () => {
        const response = GitServiceUtils_1.GitServiceUtils.getRepoName(undefined, '../dx-scanner');
        expect(response).toEqual('../dx-scanner');
    });
    it('Returns component path', () => {
        const componentMock = {
            framework: model_1.ProjectComponentFramework.UNKNOWN,
            language: model_1.ProgrammingLanguage.JavaScript,
            path: '../dx-scannerSAJK/component',
            platform: model_1.ProjectComponentPlatform.BackEnd,
            type: model_1.ProjectComponentType.Library,
            repositoryPath: 'https://www.github.com/DXHeroes/dx-scanner',
        };
        ScanningStrategy_mock_1.scanningStrategy.localPath = '../dx-scannerSAJK/';
        const response = GitServiceUtils_1.GitServiceUtils.getComponentPath(componentMock, ScanningStrategy_mock_1.scanningStrategy);
        expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner/tree/master/component');
    });
    it('Returns component path', () => {
        const componentMock = {
            framework: model_1.ProjectComponentFramework.UNKNOWN,
            language: model_1.ProgrammingLanguage.JavaScript,
            path: '../dx-scannerSAJK',
            platform: model_1.ProjectComponentPlatform.BackEnd,
            type: model_1.ProjectComponentType.Library,
            repositoryPath: 'https://www.github.com/DXHeroes/dx-scanner',
        };
        const response = GitServiceUtils_1.GitServiceUtils.getComponentPath(componentMock, Object.assign(Object.assign({}, ScanningStrategy_mock_1.scanningStrategy), { localPath: '../dx-scannerSAJK' }));
        expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
    });
    it('Returns component path without credentials', () => {
        const componentMock = {
            framework: model_1.ProjectComponentFramework.UNKNOWN,
            language: model_1.ProgrammingLanguage.JavaScript,
            path: '../dx-scannerSAJK',
            platform: model_1.ProjectComponentPlatform.BackEnd,
            type: model_1.ProjectComponentType.Library,
            repositoryPath: 'https://user:passwrod@www.github.com/DXHeroes/dx-scanner',
        };
        const response = GitServiceUtils_1.GitServiceUtils.getComponentPath(componentMock, Object.assign(Object.assign({}, ScanningStrategy_mock_1.scanningStrategy), { localPath: '../dx-scannerSAJK' }));
        expect(response).toEqual('https://www.github.com/DXHeroes/dx-scanner');
    });
});
//# sourceMappingURL=GitServiceUtils.spec.js.map