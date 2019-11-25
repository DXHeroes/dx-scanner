import * as fs from 'fs';
import { Container } from 'inversify';
import { Types } from './types';
import { cli } from 'cli-ux';
import { IPracticeWithMetadata } from './practices/DxPracticeDecorator';

export const initialize = (scanPath: string, container: Container) => {
  const yamlPath = `${scanPath}/.dxscannerrc.yaml`;
  cli.action.start(`Initializing configuration: ${yamlPath}`);
  // check if .dxscannerrc.yaml already exists
  const yamlExists: boolean = fs.existsSync(yamlPath);
  if (!yamlExists) {
    createYAML(yamlPath, container);
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
