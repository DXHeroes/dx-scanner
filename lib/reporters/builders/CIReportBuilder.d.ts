import { ComponentWithPractices, PracticeWithContextForReporter } from '..';
import { ScanningStrategy } from '../../detectors';
import { PracticeImpact } from '../../model';
import { PracticeDetail } from '../../practices/IPractice';
import { DXScoreOverallResult } from '../model';
import { IReportBuilder } from './IReportBuilder';
export declare class CIReportBuilder implements IReportBuilder {
    private readonly practicesAndComponents;
    static readonly ciReportIndicator = "<!-- CIReport ID to detect report comment -->";
    private readonly scanningStrategy;
    constructor(practicesAndComponents: PracticeWithContextForReporter[], scanningStrategy: ScanningStrategy);
    build(): string;
    /**
     * Main renderer
     */
    renderFromTemplate(): string;
    renderHeader: () => string;
    renderComponent: (cwp: ComponentWithPractices, dxScore: DXScoreOverallResult) => string;
    renderImpactSegment(practicesAndComponents: PracticeWithContextForReporter[], impact: PracticeImpact): string;
    renderPracticesLines: (practiceWithContext: PracticeWithContextForReporter) => string;
    renderUnknownPractices: (practicesAndComponents: PracticeWithContextForReporter[]) => string;
    renderTurnedOffPractices: (practicesAndComponents: PracticeWithContextForReporter[]) => string;
    renderFixablePractices: (practicesAndComponents: PracticeWithContextForReporter[]) => string;
    renderComponentHeader: (cwp: ComponentWithPractices, dxScore: DXScoreOverallResult) => string;
    renderImpactsList: (practicesAndComponents: PracticeWithContextForReporter[]) => string;
    renderFooter: (dxScore: DXScoreOverallResult) => string;
    renderDetail(detail: PracticeDetail): string;
    private renderImpactHeadline;
    private renderBadge;
    private badgeColor;
}
//# sourceMappingURL=CIReportBuilder.d.ts.map