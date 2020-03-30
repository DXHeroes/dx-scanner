import { inject, injectable } from 'inversify';
import { ReporterUtils } from '.';
import { ArgumentsProvider } from '../scanner';
import { Types } from '../types';
import { PracticeWithContextForReporter, IReporter } from './IReporter';
import { ProjectComponent } from '../model';
import Axios from 'axios';

@injectable()
export class ReporterCollectData implements IReporter {
  private readonly argumentsProvider: ArgumentsProvider;

  constructor(@inject(Types.ArgumentsProvider) argumentsProvider: ArgumentsProvider) {
    this.argumentsProvider = argumentsProvider;
  }

  async report(practicesAndComponents: PracticeWithContextForReporter[]): Promise<void> {
    const reportData = this.buildReport(practicesAndComponents);

    try {
      // send data
      await Axios.post('https://dxscanner.io/api/v1/data-report', reportData);
      console.log('You can see DX data in your DX account now.\n');
    } catch (error) {
      console.log('Your DX data has not been sent to your account.\n');
    }
  }

  buildReport(practicesAndComponents: PracticeWithContextForReporter[]): ReportData[] {
    const componentsWithPractices = ReporterUtils.getComponentsWithPractices(practicesAndComponents);

    const dxScore = ReporterUtils.computeDXScore(practicesAndComponents);
    const componentsWithScore = [];

    for (const cwp of componentsWithPractices) {
      const dxScoreForComponent = dxScore.components.find((c) => c.path === cwp.component.path)!.value;
      const componentWithScore = { component: cwp.component, dxScore: dxScoreForComponent };

      componentsWithScore.push(componentWithScore);
    }

    return componentsWithScore;
  }
}

export interface ReportData {
  component: ProjectComponent;
  dxScore: string;
}
