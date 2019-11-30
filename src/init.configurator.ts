import * as fs from 'fs';
import { Container } from 'inversify';
import { Types } from './types';
import { cli } from 'cli-ux';
import { IPracticeWithMetadata } from './practices/DxPracticeDecorator';

export const initialize = (scanPath: string, container: Container) => {
  const filePath = `${scanPath}/.dxscannerrc`;
  cli.action.start(`Initializing configuration: ${filePath}.yaml`);
  // check if .dxscannerrc.yaml already exists
  const fileExists: boolean = fs.existsSync(`${filePath}`);
  const yamlExists: boolean = fs.existsSync(`${filePath}.yaml`);
  const ymlExists: boolean = fs.existsSync(`${filePath}.yml`);
  const jsonExists: boolean = fs.existsSync(`${filePath}.json`);
  if (!yamlExists && !fileExists && !ymlExists && !jsonExists) {
    createYAML(`${filePath}.yaml`, container);
  }
  cli.action.stop();
  process.exit(0);
};

const createYAML = (yamlPath: string, container: Container) => {
  let yamlInitContent = `# practices:`;
  // get Metadata and sort it alphabetically using id
  const sortedInitializedPractices = container
    .getAll<IPracticeWithMetadata>(Types.Practice)
    .sort((a, b) => a.getMetadata().id.localeCompare(b.getMetadata().id));
  for (const practice of sortedInitializedPractices) {
    const dataObject = practice.getMetadata();
    yamlInitContent += `\n#    ${dataObject.id}: ${dataObject.impact}`;
  }
  fs.writeFileSync(yamlPath, yamlInitContent);
};
