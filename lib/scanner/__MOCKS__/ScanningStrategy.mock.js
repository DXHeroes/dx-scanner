"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanningStrategy = void 0;
const IScanningStrategy_1 = require("../../detectors/IScanningStrategy");
exports.scanningStrategy = {
    accessType: IScanningStrategy_1.AccessType.public,
    localPath: '.',
    rootPath: undefined,
    remoteUrl: 'www.github.com/DXHeroes/dx-scanner',
    isOnline: true,
    serviceType: IScanningStrategy_1.ServiceType.github,
};
//# sourceMappingURL=ScanningStrategy.mock.js.map