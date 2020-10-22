import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { DxPractice } from '../DxPracticeDecorator';
import { PracticeContext } from '../../contexts/practice/PracticeContext';
import { PracticeBase } from '../PracticeBase';
import { ReportDetailType } from '../../reporters/ReporterData';
import { FixerContext } from '../../contexts/fixer/FixerContext';

@DxPractice({
  id: 'LanguageIndependent.ReadmeCorrectlySet',
  name: 'Set README.md Correctly',
  impact: PracticeImpact.high,
  suggestion: 'Provide necessary sections in README',
  reportOnlyOnce: false,
  url: 'https://github.com/DXHeroes/knowledge-base-content/blob/master/practices/readme.md',
  dependsOn: { practicing: ['LanguageIndependent.ReadmeIsPresent'] },
})
export class ReadmeIsCorrectlySet extends PracticeBase {
  private parsedReadme: string[] = [];
  private readmePath = 'Readme.md';

  async isApplicable(): Promise<boolean> {
    return true;
  }

  async evaluate(ctx: PracticeContext): Promise<PracticeEvaluationResult> {
    if (!ctx.root.fileInspector) {
      return PracticeEvaluationResult.unknown;
    }

    const parseReadme = (readmeFile: string) => {
      return readmeFile
        .toString()
        .split(/\r?\n/)
        .filter((content) => content.trim() !== '');
    };

    const regexReadme = new RegExp('readme', 'i');
    const rootFiles = await ctx.root.fileInspector.scanFor(regexReadme, '/', { shallow: true });
    const filePath = rootFiles[0].path;
    this.readmePath = filePath;
    const content = await ctx.root.fileInspector.readFile(filePath);

    const parsedReadme = parseReadme(content);
    this.parsedReadme = parsedReadme;

    const heading = parsedReadme.filter((value: string) => /^(?:<h1>|#\s+)/.test(value)).length;
    const gettingStarted = parsedReadme.find((value: string) => /^(?:<h2>|##\s+).*(Getting\s+Started)/i.test(value));
    const prerequisites = parsedReadme.find((value: string) => /^(?:<h3>|###\s+).*(Prerequisites)/i.test(value));
    const install = parsedReadme.find((value: string) => /^(?:<h3>|###\s+).*(Install)(?:ing|ation)/i.test(value));
    const contribute = parsedReadme.find((value: string) => /^(?:<h2>|##\s+).*(Contribut)(?:ing|ion)/i.test(value));
    const license = parsedReadme.find((value: string) => /^(?:<h2>|##\s+).*(License)/i.test(value));

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
