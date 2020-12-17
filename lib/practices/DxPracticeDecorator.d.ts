import { PracticeMetadata } from '../model';
import { IPractice } from './IPractice';
export declare function DxPractice(metadata: PracticeMetadata): (target: any) => any;
export interface IPracticeWithMetadata extends IPractice {
    getMetadata(): PracticeMetadata;
}
//# sourceMappingURL=DxPracticeDecorator.d.ts.map