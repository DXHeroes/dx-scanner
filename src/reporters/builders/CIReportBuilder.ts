import { inject } from 'inversify';
import { ComponentWithPractices, PracticeWithContextForReporter, ReporterUtils } from '..';
import { ScanningStrategy } from '../../detectors';
import { assertNever } from '../../lib/assertNever';
import { PracticeEvaluationResult, PracticeImpact } from '../../model';
import { PracticeDetail } from '../../practices/IPractice';
import { GitServiceUtils } from '../../services';
import { Types } from '../../types';
import { DXScoreOverallResult, DXScoreResult } from '../model';
import { ReportDetailType, ReporterData } from '../ReporterData';
import { BadgeColor, IReportBuilder } from './IReportBuilder';

export class CIReportBuilder implements IReportBuilder {
  private readonly practicesAndComponents: PracticeWithContextForReporter[];
  static readonly ciReportIndicator = '<!-- CIReport ID to detect report comment -->';
  private readonly scanningStrategy: ScanningStrategy;

  constructor(
    practicesAndComponents: PracticeWithContextForReporter[],
    @inject(Types.ScanningStrategy) scanningStrategy: ScanningStrategy,
  ) {
    this.practicesAndComponents = practicesAndComponents;
    this.scanningStrategy = scanningStrategy;
  }

  build() {
    return this.renderFromTemplate();
  }

  /**
   * Main renderer
   */
  renderFromTemplate(): string {
    const lines: string[] = [];

    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(this.practicesAndComponents);
    const dxScore = ReporterUtils.computeDXScore(this.practicesAndComponents);

    // render html comment as an ID for updating PR comment
    lines.push(CIReportBuilder.ciReportIndicator);

    // render header
    lines.push(this.renderHeader());

    for (const cwp of componentsWithPractices) {
      // render component report
      lines.push(this.renderComponent(cwp, dxScore));
    }

    lines.push(this.renderFooter(dxScore));
    return lines.join('\n');
  }

  renderHeader = (): string => {
    const lines: string[] = [];

    lines.push(
      `# [DX Scanner](https://dxscanner.io) Report <a href="https://dxscanner.io" target="_blank"><img src="https://dxscanner.io/static/images/logo.png" alt="DXScanner.io" width="40" style="border-radius: 2px;"/></a>`,
    );

    return lines.join('\n');
  };

  renderComponent = (cwp: ComponentWithPractices, dxScore: DXScoreOverallResult): string => {
    const lines: string[] = [];

    lines.push(this.renderComponentHeader(cwp, dxScore));
    lines.push(this.renderImpactsList(cwp.practicesAndComponents));
    lines.push(this.renderUnknownPractices(cwp.practicesAndComponents));
    lines.push(this.renderTurnedOffPractices(cwp.practicesAndComponents));
    lines.push(this.renderFixablePractices(cwp.practicesAndComponents));

    return lines.join('\n');
  };

  renderImpactSegment(practicesAndComponents: PracticeWithContextForReporter[], impact: PracticeImpact): string {
    const lines: string[] = [];

    lines.push(`<h3>${this.renderImpactHeadline(impact)}</h3>`);

    // render each practice detail
    for (const practiceWithContext of practicesAndComponents) {
      lines.push(this.renderPracticesLines(practiceWithContext));
    }

    return lines.join('\n');
  }

  renderPracticesLines = (practiceWithContext: PracticeWithContextForReporter): string => {
    const lines: string[] = [];
    const practice = practiceWithContext.practice;

    lines.push(`<details>`);
    lines.push(`<summary>${practice.name}</summary>\n`);

    const practiceLineTexts = [`<b>${practice.suggestion}</b>`];
    if (practice.url) practiceLineTexts.push(`<a href="${practice.url}">${practice.url}</a>`);
    lines.push(practiceLineTexts.join(' '));

    // render detailed info for a practice
    if (practice.data?.details) {
      const linesWithDetail = practice.data.details.map((d) => this.renderDetail(d)).join(' ');
      lines.push(`\n\n${linesWithDetail}`);
    }

    // render line for changed impact if the impact of practice has been changed
    if (practice.impact !== practiceWithContext.overridenImpact) {
      lines.push(`  <b>Impact changed from ${practice.impact} to ${practiceWithContext.overridenImpact}.</b>`);
    }

    lines.push(`</details>`);

    return lines.join('\n');
  };

  renderUnknownPractices = (practicesAndComponents: PracticeWithContextForReporter[]): string => {
    const lines: string[] = [];

    const practicesAndComponentsUnknown = practicesAndComponents.filter((p) => p.isOn && p.evaluation === PracticeEvaluationResult.unknown);

    if (practicesAndComponentsUnknown.length > 0) {
      lines.push('🔥 Evaluation of these practices failed');

      for (const p of practicesAndComponentsUnknown) {
        lines.push(`- ${p.practice.name}`);
      }
    }

    return lines.join('\n');
  };

  renderTurnedOffPractices = (practicesAndComponents: PracticeWithContextForReporter[]): string => {
    const lines: string[] = [];

    const practicesAndComponentsOff = practicesAndComponents.filter((p) => !p.isOn);

    if (practicesAndComponentsOff.length > 0) {
      lines.push('🚫 You have turned off these practices');

      for (const p of practicesAndComponentsOff) {
        lines.push(`- ${p.practice.name}`);
      }
    }

    return lines.join('\n');
  };

  renderFixablePractices = (practicesAndComponents: PracticeWithContextForReporter[]): string => {
    const lines: string[] = [];
    const fixablePractice = (p: PracticeWithContextForReporter) =>
      p.practice.fix && p.evaluation === PracticeEvaluationResult.notPracticing;

    const fixablePractices = practicesAndComponents.filter(fixablePractice);
    if (fixablePractices.length) {
      lines.push('🔧 These practices might be automatically fixed:');

      for (const p of fixablePractices) {
        lines.push(`- ${p.practice.name}`);
      }
    }

    return lines.join('\n');
  };

  renderComponentHeader = (cwp: ComponentWithPractices, dxScore: DXScoreOverallResult): string => {
    const lines: string[] = [];

    const componentPath = GitServiceUtils.getComponentPath(cwp.component, this.scanningStrategy);

    // display badge for a component only if there is more than one component because there is overall DX Score at the end of report
    const badge = dxScore.components.length > 1 ? this.renderBadge(dxScore.components.find((c) => c.path === cwp.component.path)!) : '';
    lines.push(`## ${componentPath} ${badge}\n`);

    return lines.join('\n');
  };

  renderImpactsList = (practicesAndComponents: PracticeWithContextForReporter[]): string => {
    const lines: string[] = [];

    // render each impact block
    for (const key in PracticeImpact) {
      const impact = PracticeImpact[key as keyof typeof PracticeImpact];

      // filter only not practicing and turned on practices
      const practices = practicesAndComponents.filter(
        (p) => p.overridenImpact === impact && p.isOn === true && p.evaluation === PracticeEvaluationResult.notPracticing,
      );

      // do not render if no practice is not practicing
      if (practices.length !== 0) {
        lines.push(this.renderImpactSegment(practices, impact));
      }
    }

    return lines.join('\n');
  };

  renderFooter = (dxScore: DXScoreOverallResult): string => {
    const lines: string[] = [];

    lines.push(`---\n`);
    lines.push(`${this.renderBadge(dxScore)}\n`);
    lines.push('Implementation is not adoption.');
    lines.push('We can help you with both. :-)');
    lines.push('[dxheroes.io](https://dxheroes.io)');
    lines.push('\n\n');
    lines.push('##### Found a bug? Please <a href="https://github.com/DXHeroes/dx-scanner/issues" target="_blank">report</a>.');

    return lines.join('\n');
  };

  renderDetail(detail: PracticeDetail): string {
    switch (detail.type) {
      case ReportDetailType.table:
        return ReporterData.markdownTable(detail.headers, detail.data);

      case ReportDetailType.text:
        return detail.text;

      default:
        return assertNever(detail);
    }
  }

  private renderImpactHeadline = (impact: PracticeImpact): string => {
    switch (impact) {
      case PracticeImpact.high:
        return '🚨 Improvements with highest impact\n';
      case PracticeImpact.medium:
        return '⚠️ Improvements with medium impact\n';
      case PracticeImpact.small:
        return '🔔 Improvements with minor impact\n';
      case PracticeImpact.off:
        return '🚫 These practices are off\n';
      case PracticeImpact.hint:
        return '💡 Also consider';
      default:
        return assertNever(impact);
    }
  };

  private renderBadge(score: DXScoreResult) {
    return `<img src="https://img.shields.io/badge/DX%20Score-${encodeURI(score.value)}-${this.badgeColor(
      score,
    )}?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBmaWxsPSIjMzlEMkRBIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiwxOS4xNzE0Mjg2IEwxNS40Mjg1NzE0LDE1LjczNzE0MjkgTDE3LjE0Mjg1NzEsMTcuNDU0Mjg1NyBMMTIsMjIuNjA1NzE0MyBMNi44NTcxNDI4NiwxNy40NTQyODU3IEw4LjU3MTQyODU3LDE1LjczNzE0MjkgTDEyLDE5LjE3MTQyODYgWiBNMTIsNS40MzQyODU3MSBMMTUuNDI4NTcxNCwyIEwxNy4xNDI4NTcxLDMuNzE3MTQyODYgTDEyLDguODY4NTcxNDMgTDYuODU3MTQyODYsMy43MTcxNDI4NiBMOC41NzE0Mjg1NywyIEwxMiw1LjQzNDI4NTcxIFogTTEyLDEyLjMwNjY3NjcgTDE1LjQyODU3MTQsOC44NzIzOTEwMSBMMTcuMTQyODU3MSwxMC41ODk1MzM5IEwxMiwxNS43NDA5NjI0IEw2Ljg1NzE0Mjg2LDEwLjU4OTUzMzkgTDguNTcxNDI4NTcsOC44NzIzOTEwMSBMMTIsMTIuMzA2Njc2NyBaIE0yMC41NzE0Mjg2LDEwLjU4NTcxNDMgTDE3LjE0Mjg1NzEsNy4xNTE0Mjg1NyBMMTguODU3MTQyOSw1LjQzNDI4NTcxIEwyNCwxMC41ODU3MTQzIEwxOC44NTcxNDI5LDE1LjczNzE0MjkgTDE3LjE0Mjg1NzEsMTQuMDIgTDIwLjU3MTQyODYsMTAuNTg1NzE0MyBaIE0zLjQyODU3MTQzLDEwLjU4NTcxNDMgTDYuODU3MTQyODYsMTQuMDIgTDUuMTQyODU3MTQsMTUuNzM3MTQyOSBMMCwxMC41ODU3MTQzIEw1LjE0Mjg1NzE0LDUuNDM0Mjg1NzEgTDYuODU3MTQyODYsNy4xNTE0Mjg1NyBMMy40Mjg1NzE0MywxMC41ODU3MTQzIFoiLz4KPC9zdmc+Cg=="/>`;
  }

  private badgeColor(score: DXScoreResult) {
    const pctg = score.points.percentage;
    let color: BadgeColor;

    if (pctg > 90) {
      color = BadgeColor.brightgreen;
    } else if (pctg > 80) {
      color = BadgeColor.green;
    } else if (pctg > 70) {
      color = BadgeColor.yellowgreen;
    } else if (pctg > 60) {
      color = BadgeColor.yellow;
    } else if (pctg > 40) {
      color = BadgeColor.orange;
    } else {
      color = BadgeColor.red;
    }

    return color;
  }
}
