import { IPractice } from '../IPractice';
import { ErrorFactory } from '../../lib/errors/ErrorFactory';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import * as xml2js from 'xml2js';
import * as properties from 'properties';
import yaml from 'js-yaml';

@DxPractice({
  id: 'Java.Log4JConfigured',
  name: 'Use Java Logger Configuration Files',
  impact: PracticeImpact.small,
  suggestion: 'Configure your Log4J using an xml, json, yaml, properties files; or use in-code configuration',
  reportOnlyOnce: true,
  url: 'https://logging.apache.org/log4j/2.x/manual/configuration.html',
  dependsOn: { practicing: ['Java.LoggerUsedPractice'] },
})
export class JavaLog4JConfiguredPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    return ctx.projectComponent.language === ProgrammingLanguage.Java || ctx.projectComponent.language === ProgrammingLanguage.Kotlin;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const dotExtensions = new RegExp('.(xml|json|yaml|yml|properties)', 'i');
    const configurationFiles = await ctx.fileInspector.scanFor(dotExtensions, '/', { shallow: false });
    const configurationKeys = ['configuration', 'log4j:configuration', 'rootLogger', 'logger', 'loggers', 'properties', 'appender'];
    if (configurationFiles) {
      for (const file of configurationFiles) {
        if (file.baseName === 'log4j' || file.baseName === 'log4j2') {
          const fileContents = await ctx.fileInspector.readFile(file.path);
          let parsedContents;
          try {
            switch (file.extension) {
              case '.xml':
                parsedContents = await xml2js.parseStringPromise(fileContents);
                break;
              case '.json':
                parsedContents = await JSON.parse(fileContents);
                break;
              case '.yaml':
              case '.yml':
                parsedContents = yaml.load(fileContents);
                break;
              case '.properties':
                parsedContents = await properties.parse(fileContents, { namespaces: true });
                break;
              default:
                throw ErrorFactory.newNotImplementedError(`Unsupported configuration extension.`);
            }
          } catch (e) {
            throw ErrorFactory.newInternalError(`Failed to parse Log4J configuration file ${file.baseName}.${file.extension} on: ${e}`);
          }
          for (const key of Object.keys(parsedContents)) {
            if (configurationKeys.includes(key.toLowerCase())) {
              return PracticeEvaluationResult.practicing;
            }
          }
        }
      }
    }
    return PracticeEvaluationResult.notPracticing;
  }
}
