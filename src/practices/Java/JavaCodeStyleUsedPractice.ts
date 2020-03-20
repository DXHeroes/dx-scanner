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
    // note: not sure if this also applies to Kotlin
    return ctx.projectComponent.language === ProgrammingLanguage.Java;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const dotXml = new RegExp('.(xml)', 'i');
    const xmlFiles = await ctx.fileInspector.scanFor(dotXml, '/', { shallow: false });

    // note: this might not be the best way to do this -- try to find another way of distinguishing a style file
    const codeStyleKeys = ['codestylesettings', 'codestyle', 'code_scheme'];
    let flag = false;

    for (const file of xmlFiles) {
      if (file.baseName !== 'pom') {
        const contents = await ctx.fileInspector.readFile(file.path);
        const parsedContents = await xml2js.parseStringPromise(contents);
        Object.keys(parsedContents).forEach((key: string) => {
          if (codeStyleKeys.includes(key)) {
            flag = true;
          }
        });
      }
    }

    if (flag) {
      return PracticeEvaluationResult.practicing;
    }

    return PracticeEvaluationResult.notPracticing;
  }
}
