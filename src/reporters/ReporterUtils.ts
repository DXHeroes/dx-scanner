import { PracticeWithContextForReporter } from './IReporter';
import _ from 'lodash';
import { ProjectComponent } from '../model';

export class ReporterUtils {
  static getComponentsWithPractices(practicesAndComponents: PracticeWithContextForReporter[]) {
    const result: {
      component: ProjectComponent;
      practicesAndComponents: PracticeWithContextForReporter[];
    }[] = [];

    for (const pac of practicesAndComponents) {
      let component = _.find(result, { component: { path: pac.component.path } });
      if (!component) {
        const currentComponentReport = {
          component: pac.component,
          practicesAndComponents: [pac],
        };

        component = currentComponentReport;
        result.push(component);
        continue;
      } else {
        component.practicesAndComponents.push(pac);
      }
    }

    return result;
  }
}
