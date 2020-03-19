import { PracticeContext } from '../practice/PracticeContext';
import { ArgumentsProvider } from '../../scanner';
import { ScanningStrategy } from '../../detectors/ScanningStrategyDetector';

export interface FixerContext extends PracticeContext {
  argumentsProvider?: ArgumentsProvider;
  scanningStrategy?: ScanningStrategy;
}
