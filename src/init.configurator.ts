import * as fs from 'fs';
import { Container } from 'inversify';
import { Types } from './types';
import { PracticeMetadata } from './model';
import { ErrorFactory } from './lib/errors';
import { cli } from 'cli-ux';

export const initialize = (scanPath: string, container: Container) => {
  cli.action.start(`Initializing configuration: ${scanPath}`);
  const yamlPath = `${scanPath}/.dxscannerrc.yaml`;
  // check if .dxscannerrc.yaml already exists
  const yamlExists: boolean = fs.existsSync(yamlPath);
  if (!yamlExists) {
    createYAML(yamlPath, container);
  }
  cli.action.stop();
};

const createYAML = (yamlPath: string, container: Container) => {
  let yamlInitContent = `# practices:`;
  const initializedPractices: ContainerPracticeMetadata[] = container.getAll(Types.Practice);
  for (const practice of initializedPractices) {
    const dataObject = practice.getMetadata();
    yamlInitContent += `\n#    ${dataObject.id}: ${dataObject.impact}`;
  }
  fs.writeFile(yamlPath, yamlInitContent, (err) => {
    if (err) {
      throw ErrorFactory.newInternalError(err.message);
    }
  });
};

export interface ContainerPracticeMetadata {
  getMetadata(): PracticeMetadata;
}
