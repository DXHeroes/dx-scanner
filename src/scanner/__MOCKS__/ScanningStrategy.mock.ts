import { AccessType, ServiceType } from '../../detectors/IScanningStrategy';

export const scanningStrategy = {
  accessType: AccessType.public,
  localPath: '.',
  rootPath: undefined,
  remoteUrl: 'www.github.com/DXHeroes/dx-scanner',
  isOnline: true,
  serviceType: ServiceType.github,
};
