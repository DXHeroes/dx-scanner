import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { ReporterUtils } from './ReporterUtils';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';

describe('ReporterUtils', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });

  describe('#computeDXScore', () => {
    it('one practicing practice', () => {
      const result = ReporterUtils.computeDXScore([practicingHighImpactPracticeWithCtx]);

      expect(result.points.max).toEqual(100);
      expect(result.points.total).toEqual(100);
      expect(result.points.percentage).toEqual(100);
      expect(result.value).toEqual('100% | 1/1');
    });

    it('one practicing practice and one not practicing', () => {
      const result = ReporterUtils.computeDXScore([practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx]);

      expect(result.points.max).toEqual(200);
      expect(result.points.total).toEqual(100);
      expect(result.points.percentage).toEqual(50);
      expect(result.value).toEqual('50% | 1/2');
    });

    it('one practicing practice and one skipped practicing', () => {
      notPracticingHighImpactPracticeWithCtx.overridenImpact = PracticeImpact.off;
      notPracticingHighImpactPracticeWithCtx.isOn = false;

      const result = ReporterUtils.computeDXScore([practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx]);

      expect(result.points.max).toEqual(100);
      expect(result.points.total).toEqual(100);
      expect(result.points.percentage).toEqual(100);
      expect(result.value).toEqual('100% | 1/1 (1 skipped)');
    });

    it('one skipped practice', () => {
      notPracticingHighImpactPracticeWithCtx.overridenImpact = PracticeImpact.off;
      notPracticingHighImpactPracticeWithCtx.isOn = false;

      const result = ReporterUtils.computeDXScore([notPracticingHighImpactPracticeWithCtx]);

      expect(result.points.max).toEqual(0);
      expect(result.points.total).toEqual(0);
      expect(result.points.percentage).toEqual(0);
      expect(result.value).toEqual('0% | 0/0 (1 skipped)');
    });
  });

  describe('#getComponentsWithPractices', () => {
    it('returns one component with one practiceWithContext', () => {
      const result = ReporterUtils.getComponentsWithPractices([practicingHighImpactPracticeWithCtx]);

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);
    });

    it('returns one component with two practiceWithContext', () => {
      const result = ReporterUtils.getComponentsWithPractices([practicingHighImpactPracticeWithCtx, practicingHighImpactPracticeWithCtx]);

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
      expect(result[0].practicesAndComponents.length).toEqual(2);
      expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);
      expect(result[0].practicesAndComponents[1]).toEqual(practicingHighImpactPracticeWithCtx);
    });

    it('returns two components on different path with one practiceWithContext each', () => {
      const mockPracticeWithContext2nd = practiceWithContextFactory({ component: { path: './2nd' } });

      const result = ReporterUtils.getComponentsWithPractices([practicingHighImpactPracticeWithCtx, mockPracticeWithContext2nd]);

      expect(result.length).toEqual(2);

      expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);

      expect(result[1].component).toEqual(mockPracticeWithContext2nd.component);
      expect(result[1].practicesAndComponents.length).toEqual(1);
      expect(result[1].practicesAndComponents[0]).toEqual(mockPracticeWithContext2nd);
    });
  });
});
