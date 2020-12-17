"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const inversify_config_1 = require("../inversify.config");
describe('FileInspector', () => {
    let fileInspector;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('FileInspector').to(_1.FileInspector);
        fileInspector = containerCtx.container.get('FileInspector');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Throws an error if the file does not exist', async () => {
        const path = './';
        try {
            await fileInspector.scanFor('.gitignore', path);
            fail();
        }
        catch (error) {
            expect(error.message).toMatch(/ENOENT: no such file or directory, readdir/);
        }
    });
});
//# sourceMappingURL=FileInspector.spec.js.map