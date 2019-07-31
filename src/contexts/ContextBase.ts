import { IInitiable } from '../lib/IInitable';
import { injectable } from 'inversify';

@injectable()
export abstract class ContextBase implements IInitiable {
  abstract init(): Promise<void>;
}
