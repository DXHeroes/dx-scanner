import { injectable } from 'inversify';
import { PracticeContext } from './practice/PracticeContext';
import yaml from 'js-yaml';

@injectable()
export class ConfigProvider {
  async isConfigApplicable(ctx: PracticeContext) {
    if (ctx.fileInspector === undefined) {
      return undefined;
    }

    const regexConfigFile = new RegExp('dxscannerrc.', 'i');
    const configFileMetadata = await ctx.fileInspector.scanFor(regexConfigFile, '/', { shallow: true });

    const configFile = configFileMetadata.find((path) => path.path[0]);

    if (!configFile) {
      return undefined;
    }

    let parsedContent;
    const content = await ctx.fileInspector.readFile(configFile.path);

    const extension = configFile.path.split('.').pop();
    if (extension === 'json' || extension === '') {
      parsedContent = JSON.parse(content);
    }
    // if (extension === 'yml') {
    //   parsedFile = yaml.safeLoad(content);
    // }

    const practicesInConfig = [];
    for (const practice in parsedContent.practices) {
      const value = parsedContent.practices[practice];
      if (value === 'off') {
        practicesInConfig.push(practice);
      }
    }

    return practicesInConfig;
  }
}
