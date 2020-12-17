import { PracticeDetail } from '../../practices/IPractice';
import { ComponentWithPractices, PracticeWithContextForReporter, DXScoreOverallResult } from '..';
import { PracticeImpact } from '../../model';
export interface IReportBuilder {
    /**
     * Render report header
     */
    renderHeader(): string;
    /**
     * Render Component detail with all practices and impact segments
     */
    renderComponent(cwp: ComponentWithPractices, dxScore: DXScoreOverallResult): string;
    /**
     * Render header for a single component
     */
    renderComponentHeader(cwp: ComponentWithPractices, dxScore: DXScoreOverallResult): string;
    /**
     * Render all impacts in a list
     */
    renderImpactsList(practicesAndComponents: PracticeWithContextForReporter[]): string;
    /**
     * Render one impact segment with all its practices
     */
    renderImpactSegment(practicesAndComponents: PracticeWithContextForReporter[], impact: PracticeImpact): string;
    /**
     * Render all practices
     */
    renderPracticesLines(practiceWithContext: PracticeWithContextForReporter): string;
    /**
     * Render all unknown evaluated practices
     */
    renderUnknownPractices(practicesAndComponents: PracticeWithContextForReporter[]): string;
    /**
     * Render all turned off practices
     */
    renderTurnedOffPractices(practicesAndComponents: PracticeWithContextForReporter[]): string;
    /**
     * Render report footer
     */
    renderFooter(dxScore: DXScoreOverallResult): string;
    /**
     * Render detail for a practice
     */
    renderDetail(detail: PracticeDetail): string;
}
export declare enum BadgeColor {
    brightgreen = "brightgreen",
    green = "green",
    yellowgreen = "yellowgreen",
    yellow = "yellow",
    orange = "orange",
    red = "red"
}
//# sourceMappingURL=IReportBuilder.d.ts.map