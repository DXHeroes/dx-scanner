import { HTMLReporter } from './HTMLReporter';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { argumentsProviderFactory } from '../test/factories/ArgumentsProviderFactory';
import { FileSystemService } from '../services';
import path from 'path';
import { DirectoryJSON } from 'memfs/lib/volume';

describe('HTMLReporter', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });
  const reportPath = path.resolve(process.cwd(), 'report.html');
  let virtualFileSystemService: FileSystemService;

  beforeEach(() => {
    virtualFileSystemService = new FileSystemService({ isVirtual: true });
    const structure: DirectoryJSON = { [process.cwd()]: null };
    virtualFileSystemService.setFileSystem(structure);
  });

  afterEach(async () => {
    virtualFileSystemService.clearFileSystem();
  });

  describe('#report', () => {
    it('one practicing practice', async () => {
      await new HTMLReporter(argumentsProviderFactory(), virtualFileSystemService).report([practicingHighImpactPracticeWithCtx]);

      const result = await virtualFileSystemService.readFile(reportPath);
      await virtualFileSystemService.deleteFile(reportPath);
      expect(result).toContain('DX Score: 100% | 1/1');
    });

    it('one practicing practice and one not practicing', async () => {
      await new HTMLReporter(argumentsProviderFactory(), virtualFileSystemService).report([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
      ]);

      const result = await virtualFileSystemService.readFile(reportPath);
      await virtualFileSystemService.deleteFile(reportPath);
      expect(result).toContain('DX Score: 50% | 1/2');
    });

    it('all impacted practices', async () => {
      await new HTMLReporter(argumentsProviderFactory(), virtualFileSystemService).report([
        practicingHighImpactPracticeWithCtx,
        notPracticingHighImpactPracticeWithCtx,
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.medium,
          evaluation: PracticeEvaluationResult.notPracticing,
        }),
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.small,
          evaluation: PracticeEvaluationResult.notPracticing,
        }),
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.hint,
          evaluation: PracticeEvaluationResult.notPracticing,
        }),
        practiceWithContextFactory({
          overridenImpact: PracticeImpact.off,
          evaluation: PracticeEvaluationResult.notPracticing,
          isOn: false,
        }),
        practiceWithContextFactory({ overridenImpact: PracticeImpact.high, evaluation: PracticeEvaluationResult.unknown }),
      ]);

      const result = await virtualFileSystemService.readFile(reportPath);
      await virtualFileSystemService.deleteFile(reportPath);

      expect(result).toContain('Improvements with highest impact');
      expect(result).toContain('Improvements with medium impact');
      expect(result).toContain('Improvements with minor impact');
      expect(result).toContain('Also consider');
      expect(result).toContain('Evaluation of these practices failed');
      expect(result).toContain('You have turned off these practices');
    });
  });
});
