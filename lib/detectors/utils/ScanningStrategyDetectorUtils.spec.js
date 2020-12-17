"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScanningStrategyDetectorUtils_1 = require("./ScanningStrategyDetectorUtils");
describe('ScanningStrategyDetectorUtils', () => {
    describe('#isLocalPath', () => {
        it('is absolute local path ', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath('/local/path');
            expect(result).toEqual(true);
        });
        it('is relative local path ', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath('local/path');
            expect(result).toEqual(true);
        });
        it('is local path with tilda', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath('~/local/path');
            expect(result).toEqual(true);
        });
        it('is local path with dot in a name of a folder', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isLocalPath('some.local/path');
            expect(result).toEqual(true);
        });
    });
    describe('#isGitHubPath', () => {
        it('is GitHub path with https protocol', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitHubPath('https://github.com/DXHeroes/dx-scanner');
            expect(result).toEqual(true);
        });
        it('is GitHub path with http protocol', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitHubPath('http://github.com/DXHeroes/dx-scanner');
            expect(result).toEqual(true);
        });
        it('is GitHub path with ssl protocol', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitHubPath('ssl://git@github.com/DXHeroes/dx-scanner');
            expect(result).toEqual(true);
        });
        it('is GitHub path without protocol', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitHubPath('github.com/DXHeroes/dx-scanner');
            expect(result).toEqual(true);
        });
    });
    describe('#isGitLabPath', () => {
        describe('SaaS', () => {
            it('is GitLab path with https protocol', async () => {
                const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitLabPath('https://gitlab.com/DXHeroes/dx-scanner');
                expect(result).toEqual(true);
            });
            it('is GitLab path with http protocol', async () => {
                const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitLabPath('http://gitlab.com/DXHeroes/dx-scanner');
                expect(result).toEqual(true);
            });
            it('is GitLab path with ssl protocol', async () => {
                const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitLabPath('ssl://git@gitlab.com/DXHeroes/dx-scanner');
                expect(result).toEqual(true);
            });
            it('is GitLab path without protocol', async () => {
                const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.isGitLabPath('gitlab.com/DXHeroes/dx-scanner');
                expect(result).toEqual(true);
            });
        });
    });
    describe('#normalizePath', () => {
        it('normalizePath GitHub path without protocol', async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.normalizePath('github.com/DXHeroes/dx-scanner');
            expect(result).toEqual('https://github.com/DXHeroes/dx-scanner');
        });
        it("doesn't normalize local path", async () => {
            const result = ScanningStrategyDetectorUtils_1.ScanningStrategyDetectorUtils.normalizePath('local/path');
            expect(result).toEqual('local/path');
        });
    });
});
//# sourceMappingURL=ScanningStrategyDetectorUtils.spec.js.map