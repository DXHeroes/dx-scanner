import { inject, injectable } from 'inversify';
import yaml from 'js-yaml';
import _ from 'lodash';
import { IFileInspector } from '../inspectors/IFileInspector';
import { Types } from '../types';
import { IConfigProvider } from './IConfigProvider';

@injectable()
export class ConfigProvider implements IConfigProvider {
  private readonly fileInspector: IFileInspector;
  config: any;

  constructor(@inject(Types.IFileInspector) fileInspector: IFileInspector) {
    this.fileInspector = fileInspector;
    this.config = undefined;
  }

  async init() {
    const regexConfigFile = new RegExp('dxscannerrc.', 'i');

    const configFileMetadata = await this.fileInspector.scanFor(regexConfigFile, '/', { shallow: true });

    if (configFileMetadata.length === 0) {
      return undefined;
    }
    const configFile = configFileMetadata[0];

    let parsedContent;
    const content = await this.fileInspector.readFile(configFile.path);

    if (configFile.extension === '.json' || configFile.extension === '') {
      parsedContent = JSON.parse(content);
    }
    if (configFile.extension === '.yml' || configFile.extension === '.yaml') {
      parsedContent = yaml.safeLoad(content);
    }

    this.config = parsedContent;
  }

  getOverridenPractice(practiceId: string) {
    return _.get(this.config, ['practices', practiceId]);
  }
}
