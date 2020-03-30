import { IPractice } from '../IPractice';
import { PracticeEvaluationResult, PracticeImpact, ProgrammingLanguage } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import * as xml2js from 'xml2js';

@DxPractice({
  id: 'Java.CodeStyleUsedPractice',
  name: 'Use Java Code Styles',
  impact: PracticeImpact.small,
  suggestion: 'Use code style settings file for repository to apply code conventions for everyone in your team.',
  reportOnlyOnce: true,
  url: 'https://google.github.io/styleguide/javaguide.html',
})
export class JavaCodeStyleUsedPractice implements IPractice {
  async isApplicable(ctx: PracticeContext): Promise<boolean> {
    // note: these styles do not apply to Kotlin
    return ctx.projectComponent.language === ProgrammingLanguage.Java;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector || !ctx.packageInspector) {
      return PracticeEvaluationResult.unknown;
    }
    // java code styles
    if (
      ctx.packageInspector.hasOneOfPackages([
        'com.github.sherter.googlejavaformatgradleplugin:google-java-format-gradle-plugin',
        'com.google.googlejavaformat:google-java-format',
        'io.spring.javaformat:spring-javaformat-gradle-plugin',
      ])
    ) {
      return PracticeEvaluationResult.practicing;
    }

    const dotXml = new RegExp('.(xml)', 'i');
    const xmlFiles = await ctx.fileInspector.scanFor(dotXml, '/', { shallow: false });
    const codeStyleKeys = ['codestylesettings', 'codestyle', 'code_scheme'];

    for (const file of xmlFiles) {
      if (file.baseName !== 'pom') {
        const fileContents = await ctx.fileInspector.readFile(file.path);
        const parsedContents = await xml2js.parseStringPromise(fileContents);
        for (const key of Object.keys(parsedContents)) {
          if (codeStyleKeys.includes(key)) {
            return PracticeEvaluationResult.practicing;
          }
        }
      }
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
