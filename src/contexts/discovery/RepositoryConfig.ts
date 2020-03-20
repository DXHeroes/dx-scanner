import { ServiceType, RemoteService, AccessType } from '../../detectors';

export interface RepositoryConfig {
  remoteService: RemoteService;
  accessType: AccessType | undefined;
  inputType: ServiceType | undefined;
  host: string | undefined;
  protocol: string | undefined;
}
