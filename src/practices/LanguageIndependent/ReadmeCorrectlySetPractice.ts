import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';

@DxPractice({
  id: 'LanguageIndependent.ReadmeCorrectlySet',
  name: 'Set README.md Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Provide necessary sections in README',
  reportOnlyOnce: false,
  url: 'https://developerexperience.io/practices/readme',
  dependsOn: { practicing: ['LanguageIndependent.ReadmeIsPresent'] },
})
export class ReadmeIsCorrectlySet extends PracticeBase {
  private parseReadme(readmeFile: string): string[] {
    return readmeFile
      .toString()
      .split(/\r?\n/)
      .filter((content) => content.trim() !== '');
  }

  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const regexReadme = new RegExp('readme', 'i');
    const rootFiles = await ctx.root.fileInspector.scanFor(regexReadme, '/', { shallow: true });
    const filePath = rootFiles[0].path;
    const content = await ctx.root.fileInspector.readFile(filePath);

    const parsedReadme = this.parseReadme(content);

    const heading = parsedReadme.filter((value: string) => /^(?:<h1>|#[^#])/.test(value)).length;
    const gettingStarted = parsedReadme.find((value: string) => /^(?:<h[2-6]>|#{2}).*(Getting\s+Started)/i.test(value));
    const prerequisites = parsedReadme.find((value: string) => /^(?:<h[2-6]>|#{2}).*(Prerequisites)/i.test(value));
    const install = parsedReadme.find((value: string) => /^(?:<h[2-6]>|#{2}).*(Install)(?:ing|ation)/i.test(value));
    const contribute = parsedReadme.find((value: string) => /^(?:<h[2-6]>|#{2}).*(Contribut)(?:ing|ion)/i.test(value));
    const license = parsedReadme.find((value: string) => /^(?:<h[2-6]>|#{2}).*(License)/i.test(value));

    if (heading === 1 && gettingStarted && prerequisites && install && contribute && license) {
      return PracticeEvaluationResult.practicing;
    }

    this.setData();
    return PracticeEvaluationResult.notPracticing;
  }

  private setData() {
    this.data.details = [
      {
        type: ReportDetailType.text,
        text:
          'You should have a single h1, getting started (h2), prerequisites(h3), installation(h3), contributing(h2) and license(h2) sections in readme.',
      },
    ];
  }
}
