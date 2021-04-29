"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const promise_1 = __importDefault(require("simple-git/promise"));
const inversify_config_1 = require("../inversify.config");
const gitHubNock_1 = require("../test/helpers/gitHubNock");
const ScanningStrategyDetector_1 = require("./ScanningStrategyDetector");
const services_1 = require("../services");
const GitLabService_1 = require("../services/gitlab/GitLabService");
const ArgumentsProviderFactory_1 = require("../test/factories/ArgumentsProviderFactory");
const IScanningStrategy_1 = require("./IScanningStrategy");
const gitLabNock_1 = require("../test/helpers/gitLabNock");
jest.mock('simple-git/promise');
describe('ScanningStrategyDetector', () => {
    const mockedGit = promise_1.default;
    beforeEach(() => {
        nock_1.default.cleanAll();
        nock_1.default.enableNetConnect();
    });
    describe('#detect', () => {
        it('local path without remote', async () => {
            const nock = new gitLabNock_1.GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
            nock.listProjects();
            nock.listGroups();
            nock.checkVersion();
            nock.getRepoResponse(404);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: undefined,
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: undefined,
                isOnline: false,
                serviceType: IScanningStrategy_1.ServiceType.local,
            });
        });
        it('local path that is a git repository', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/rootDir',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/rootDir/subDir' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.public,
                localPath: '/local/rootDir/subDir',
                rootPath: '/local/rootDir',
                remoteUrl: repoPath,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('local path that is not a git repository', async () => {
            const nock = new gitLabNock_1.GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
            nock.listProjects();
            nock.listGroups();
            nock.checkVersion();
            nock.getRepoResponse(404);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => false,
                    getRemotes: () => [],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/rootDir/subDir' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: undefined,
                localPath: '/local/rootDir/subDir',
                rootPath: '/local/rootDir/subDir',
                remoteUrl: undefined,
                isOnline: false,
                serviceType: IScanningStrategy_1.ServiceType.local,
            });
        });
        it('local path with remote public GitHub and auth', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.public,
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: repoPath,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('offline local path with remote public GitHub and auth', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
            nock_1.default.disableNetConnect();
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(500);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.unknown,
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: repoPath,
                isOnline: false,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('local path with remote public GitHub and no auth', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: 'public',
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: repoPath,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('offline local path with remote public GitHub and no auth', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner.git';
            nock_1.default.disableNetConnect();
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(500);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.unknown,
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: repoPath,
                isOnline: false,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('local path with remote private GitHub', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner-private.git';
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(404);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.unknown,
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: repoPath,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('local path with remote unsupported VCS', async () => {
            const repoPath = 'http://www.example.com/my/own/project.git';
            nock_1.default.disableNetConnect();
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: undefined,
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: undefined,
                isOnline: false,
                serviceType: IScanningStrategy_1.ServiceType.local,
            });
        });
        it('local path with remote private GitHub, error 402', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner-private.git';
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(402);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
            try {
                await scanningStrategyDetector.detect();
                fail();
            }
            catch (error) {
                expect(error.name).toMatch('HttpError');
            }
        });
        it('offline local path with remote private GitHub', async () => {
            const repoPath = 'git@github.com:DXHeroes/dx-scanner-private.git';
            nock_1.default.disableNetConnect();
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(500);
            mockedGit.mockImplementation(() => {
                return {
                    checkIsRepo: () => true,
                    revparse: () => '/local/path',
                    getRemotes: () => [{ name: 'origin', refs: { fetch: repoPath, push: repoPath } }],
                };
            });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: '/local/path', auth: 'fake_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.unknown,
                localPath: '/local/path',
                rootPath: '/local/path',
                remoteUrl: repoPath,
                isOnline: false,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('remote public GitHub', async () => {
            const repoPath = 'https://github.com/DXHeroes/dx-scanner.git';
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.public,
                localPath: undefined,
                remoteUrl: repoPath,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('remote private GitHub', async () => {
            const repoPath = 'https://github.com/DXHeroes/dx-scanner-private.git';
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner-private').getRepo('').reply(404);
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'fake_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.unknown,
                localPath: undefined,
                remoteUrl: repoPath,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('remote public GitHub without protocol in the URL', async () => {
            const repoPath = 'github.com/DXHeroes/dx-scanner.git';
            new gitHubNock_1.GitHubNock('1', 'DXHeroes', 1, 'dx-scanner').getRepo('').reply(200);
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'fake_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.public,
                localPath: undefined,
                remoteUrl: `https://${repoPath}`,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.github,
            });
        });
        it('remote private GitLab without protocol in the URL with valid credentials', async () => {
            const repoPath = 'gitlab.com/DXHeroes/dx-scanner.git';
            const nock = new gitLabNock_1.GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
            nock.listProjects();
            nock.listGroups();
            nock.checkVersion();
            nock.getRepoResponse(200, { visibility: 'private' });
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'valid_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.private,
                localPath: undefined,
                remoteUrl: `https://${repoPath}`,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.gitlab,
            });
        });
        it('remote private GitLab without protocol in the URL with invalid credentials', async () => {
            const repoPath = 'gitlab.com/DXHeroes/dx-scanner.git';
            const nock = new gitLabNock_1.GitLabNock('DXHeroes', 'dx-scanner', 'gitlab.com');
            nock.listProjects();
            nock.listGroups();
            nock.checkVersion().reply(403);
            nock.getRepoResponse(403);
            const scanningStrategyDetector = await createScanningStrategyDetector({ uri: repoPath, auth: 'invalid_token' });
            const result = await scanningStrategyDetector.detect();
            expect(result).toEqual({
                accessType: IScanningStrategy_1.AccessType.unknown,
                localPath: undefined,
                remoteUrl: `https://${repoPath}`,
                isOnline: true,
                serviceType: IScanningStrategy_1.ServiceType.gitlab,
            });
        });
        const createScanningStrategyDetector = async (args) => {
            const container = inversify_config_1.createTestContainer(args);
            const argumentsProvider = ArgumentsProviderFactory_1.argumentsProviderFactory(args);
            const repositoryConfig = await container.scanningStrategyExplorer.explore();
            return new ScanningStrategyDetector_1.ScanningStrategyDetector(new services_1.GitHubService(argumentsProvider, repositoryConfig), new services_1.BitbucketService(argumentsProvider, repositoryConfig), new GitLabService_1.GitLabService(argumentsProvider, repositoryConfig), argumentsProvider, repositoryConfig);
        };
    });
});
//# sourceMappingURL=ScanningStrategyDetector.spec.js.map