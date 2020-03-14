import { injectable, inject } from 'inversify';
import { PracticeImpact, PracticeMetadata, PracticeEvaluationResult } from '../model';
import { IReporter, PracticeWithContextForReporter } from './IReporter';
import { ReporterUtils } from './ReporterUtils';
import { PracticeDetail } from '../practices/IPractice';
import { GitServiceUtils } from '../services/git/GitServiceUtils';
import { ReportDetailType, ReporterData } from './ReporterData';
import { assertNever } from '../lib/assertNever';
import { ArgumentsProvider } from '../scanner';
import { FileSystemService } from '../services';
import { Types } from '../types';
import path from 'path';

@injectable()
export class HTMLReporter implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;
  private readonly fileSystemService: FileSystemService;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider, @inject(FileSystemService) fileSystemService: FileSystemService) {
    this.argumentsProvider = argumentsProvider;
    this.fileSystemService = fileSystemService;
  }

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    const reportHTML = this.buildReport(practicesAndComponents);

    let reportPath = this.argumentsProvider.html;
    if (!reportPath) reportPath = 'report.html';

    await this.fileSystemService.writeFile(path.resolve(process.cwd(), reportPath), reportHTML);
    console.log('Report was saved to ' + reportPath);
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): string {
    const lines: string[] = [];

    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);
    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents);

    lines.push('<h1 style="text-align: center">DX Scanner Result</h1>');

    let repoName;

    for (const cwp of componentsWithPractices) {
      repoName = GitServiceUtils.getRepoName(cwp.component.repositoryPath, cwp.component.path);

      lines.push(`<p style="border-bottom: 1px solid #eaecef">Developer Experience Report for ${repoName}</br>`);
      lines.push(`DX Score: ${dxScore.components.find((c) => c.path === cwp.component.path)!.value}</p>`);

      for (const key in PracticeImpact) {
        const impact = PracticeImpact[key as keyof typeof PracticeImpact];

        const impactLine = this.emitImpactSegment(cwp.practicesAndComponents, impact);
        impactLine && lines.push(impactLine);
      }

      const practicesAndComponentsUnknown = cwp.practicesAndComponents.filter(
        (p) => p.isOn && p.evaluation === PracticeEvaluationResult.unknown,
      );
      if (practicesAndComponentsUnknown.length > 0)
        lines.push(this.renderPracticesAndComponents('Evaluation of these practices failed', practicesAndComponentsUnknown));

      const practicesAndComponentsOff = cwp.practicesAndComponents.filter((p) => !p.isOn);
      if (practicesAndComponentsOff.length > 0)
        lines.push(this.renderPracticesAndComponents('You have turned off these practices', practicesAndComponentsOff));
    }

    lines.push(`<h2 style="text-align: center; border-top: 1px solid #eaecef; padding: 20px 0">Your overall score is ${dxScore.value}.</h2>`);
    lines.push('<div style="text-align: center; background-color: gray; margin: 0; padding: 10px">');
    lines.push('<a>Implementation is not adoption.</br>');
    lines.push('We can help you with both. :-)</br>');
    lines.push('https://dxheroes.io</p>');
    lines.push('</div>');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Report</title>
      </head>
      <div>${lines.join('\n')}</div>
      </html>
    `;
  }

  private emitImpactSegment(practicesAndComponents: PracticeWithContextForReporter[], impact: PracticeImpact): string | undefined {
    const lines: string[] = [];

    const practices = practicesAndComponents.filter(
      (p) => p.overridenImpact === impact && p.isOn === true && p.evaluation === PracticeEvaluationResult.notPracticing,
    );

    if (practices.length === 0) return undefined;

    let color,
      text;

    if (impact === PracticeImpact.high) {
      color = 'rgba(255,0,0,.5)';
      text = 'Improvements with highest impact:';
    } else if (impact === PracticeImpact.medium) {
      color = 'rgba(255,196,0,.5)';
      text = 'Improvements with medium impact:';
    } else if (impact === PracticeImpact.small) {
      color = 'rgba(0,255,0,.5)';
      text = 'Improvements with minor impact:';
    } else if (impact === PracticeImpact.off) {
      color = 'rgba(255,255,255,.5)';
      text = 'These practices are off:';
    } else {
      color = 'rgba(255,255,255,.5)';
      text = 'Also consider:';
    }
    lines.push(`<div style="background-color: ${color}; padding: 2px">`);
    lines.push(`<h3 style="margin-left: 10px">${text}</h3>`);


    lines.push('<ul>');
    for (const practiceWithContext of practices) {
      lines.push(this.linesForPractice(practiceWithContext.practice));

      if (this.argumentsProvider.details && practiceWithContext.practice.data?.details) {
        const linesWithDetail = practiceWithContext.practice.data.details.map((d) => this.renderDetail(d)).join(' ');
        lines.push(`<em>${linesWithDetail}</em>`);
      }

      if (practiceWithContext.practice.impact !== practiceWithContext.overridenImpact) {
        lines.push(
          `<em>Impact changed from ${practiceWithContext.practice.impact} to ${practiceWithContext.overridenImpact}.</em>`,
        );
      }
    }

    lines.push('</ul>');
    lines.push('</div>');
    return lines.join('\n');
  }

  private linesForPractice(practice: PracticeMetadata): string {
    const findingPath = '';
    let practiceLineText = `<li>${practice.name} - ${practice.suggestion}`;
    if (practice.url)
      practiceLineText += `${findingPath}${practice.url}`;

    practiceLineText += '</li>';
    return practiceLineText;
  }

  private renderDetail(detail: PracticeDetail) {
    switch (detail.type) {
      case ReportDetailType.table:
        return ReporterData.table(detail.headers, detail.data);

      case ReportDetailType.text:
        return detail.text;

      default:
        return assertNever(detail);
    }
  }

  private renderPracticesAndComponents(name: string, practicesAndComponents: PracticeWithContextForReporter[]) {
    const lines = [];
    lines.push('<div style="background-color: rgba(255,0,0,.5); padding: 2px">');
    lines.push(`<h3 style="margin-left: 10px">${name}:</h3>`);
    lines.push('<ul>');

    for (const p of practicesAndComponents) {
      lines.push(`<li>${p.practice.name}</li>`);
    }
    lines.push('</ul>');
    lines.push('</div>');

    return lines.join('\n');
  }
}
