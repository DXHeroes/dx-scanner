import { PracticeContext } from '../practice/PracticeContext';
import { ArgumentsProvider } from '../../scanner';
import { ScanningStrategy } from '../../detectors/ScanningStrategyDetector';
import { FileSystemService } from '../../services';

export interface FixerContext extends PracticeContext {
  argumentsProvider?: ArgumentsProvider;
  scanningStrategy?: ScanningStrategy;
  fileService?: FileSystemService;
}
