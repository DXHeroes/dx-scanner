import { ServiceType } from '../detectors/IScanningStrategy';

export interface RepositoryConfig {
  remoteUrl: string | undefined;
  host: string | undefined;
  protocol: string | undefined;
  baseUrl: string | undefined;
  basePath?: string; // local path to root folder (whether to the tmp folder if dxs scans remote url or local root folder of the repo)
  localScanning?: boolean; // dxs is running remotely or local
  serviceType?: ServiceType | undefined;
}
