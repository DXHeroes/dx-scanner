import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { ReporterUtils } from './ReporterUtils';
import { practiceWithContextFactory } from '../test/factories/PracticeWithContextFactory';
import { AccessType, ServiceType } from '../detectors/IScanningStrategy';
import { ScanningStrategy } from '../detectors';

describe('ReporterUtils', () => {
  const practicingHighImpactPracticeWithCtx = practiceWithContextFactory();
  const notPracticingHighImpactPracticeWithCtx = practiceWithContextFactory({ evaluation: PracticeEvaluationResult.notPracticing });
  const scanningStrategy: ScanningStrategy = {
    accessType: AccessType.public,
    localPath: '.',
    rootPath: undefined,
    remoteUrl: 'www.github.com/DXHeroes/dx-scanner',
    isOnline: true,
    serviceType: ServiceType.github,
  };

  describe('#computeDXScore', () => {
    it('one practicing practice', () => {
      const result = ReporterUtils.computeDXScore([practicingHighImpactPracticeWithCtx], scanningStrategy);

      expect(result.points.max).toEqual(100);
      expect(result.points.total).toEqual(100);
      expect(result.points.percentage).toEqual(100);
      expect(result.value).toEqual('100% | 1/1');
    });

    it('one practicing practice and one not practicing', () => {
      const result = ReporterUtils.computeDXScore(
        [practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx],
        scanningStrategy,
      );

      expect(result.points.max).toEqual(200);
      expect(result.points.total).toEqual(100);
      expect(result.points.percentage).toEqual(50);
      expect(result.value).toEqual('50% | 1/2');
    });

    it('one practicing practice and one skipped practicing', () => {
      notPracticingHighImpactPracticeWithCtx.overridenImpact = PracticeImpact.off;
      notPracticingHighImpactPracticeWithCtx.isOn = false;

      const result = ReporterUtils.computeDXScore(
        [practicingHighImpactPracticeWithCtx, notPracticingHighImpactPracticeWithCtx],
        scanningStrategy,
      );

      expect(result.points.max).toEqual(100);
      expect(result.points.total).toEqual(100);
      expect(result.points.percentage).toEqual(100);
      expect(result.value).toEqual('100% | 1/1 (1 skipped)');
    });

    it('one skipped practice', () => {
      notPracticingHighImpactPracticeWithCtx.overridenImpact = PracticeImpact.off;
      notPracticingHighImpactPracticeWithCtx.isOn = false;

      const result = ReporterUtils.computeDXScore([notPracticingHighImpactPracticeWithCtx], scanningStrategy);

      expect(result.points.max).toEqual(0);
      expect(result.points.total).toEqual(0);
      expect(result.points.percentage).toEqual(0);
      expect(result.value).toEqual('0% | 0/0 (1 skipped)');
    });
  });

  describe('#getComponentsWithPractices', () => {
    it('returns one component with one practiceWithContext', () => {
      const result = ReporterUtils.getComponentsWithPractices([practicingHighImpactPracticeWithCtx], scanningStrategy);

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);
    });

    it('returns one component with two practiceWithContext', () => {
      const result = ReporterUtils.getComponentsWithPractices(
        [practicingHighImpactPracticeWithCtx, practicingHighImpactPracticeWithCtx],
        scanningStrategy,
      );

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
      expect(result[0].practicesAndComponents.length).toEqual(2);
      expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);
      expect(result[0].practicesAndComponents[1]).toEqual(practicingHighImpactPracticeWithCtx);
    });

    it('returns two components on different path with one practiceWithContext each', () => {
      const mockPracticeWithContext2nd = practiceWithContextFactory({ component: { path: './2nd' } });

      const result = ReporterUtils.getComponentsWithPractices(
        [practicingHighImpactPracticeWithCtx, mockPracticeWithContext2nd],
        scanningStrategy,
      );

      expect(result.length).toEqual(2);

      expect(result[0].component).toEqual(practicingHighImpactPracticeWithCtx.component);
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practicingHighImpactPracticeWithCtx);

      expect(result[1].component).toEqual(mockPracticeWithContext2nd.component);
      expect(result[1].practicesAndComponents.length).toEqual(1);
      expect(result[1].practicesAndComponents[0]).toEqual(mockPracticeWithContext2nd);
    });

    it('returns component with Github strategy and correct repositoryPath and path', () => {
      const scStr: ScanningStrategy = {
        accessType: AccessType.private,
        localPath: 'myApp',
        rootPath: undefined,
        remoteUrl: 'https://user:password@github.com/DXHeroes/dx-scanner.git',
        isOnline: true,
        serviceType: ServiceType.github,
      };
      const practiceWithContext = practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
      const result = ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual({
        ...practiceWithContext.component,
        repositoryPath: 'https://github.com/DXHeroes/dx-scanner/tree/master/myApp',
        path: 'myApp',
      });
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
    });

    it('returns component with GitLab strategy and correct repositoryPath and path', () => {
      const scStr: ScanningStrategy = {
        accessType: AccessType.private,
        localPath: 'myApp',
        rootPath: undefined,
        remoteUrl: 'https://user:password@gitlab.com/DXHeroes/dx-scanner.git',
        isOnline: true,
        serviceType: ServiceType.gitlab,
      };
      const practiceWithContext = practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
      const result = ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual({
        ...practiceWithContext.component,
        repositoryPath: 'https://gitlab.com/DXHeroes/dx-scanner/tree/master/myApp',
        path: 'myApp',
      });
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
    });

    it('returns component with Bitbucket strategy and correct repositoryPath and path', () => {
      const scStr: ScanningStrategy = {
        accessType: AccessType.private,
        localPath: 'myApp',
        rootPath: undefined,
        remoteUrl: 'https://user:password@bitbucket.org/DXHeroes/dx-scanner.git',
        isOnline: true,
        serviceType: ServiceType.bitbucket,
      };
      const practiceWithContext = practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
      const result = ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual({
        ...practiceWithContext.component,
        repositoryPath: 'https://bitbucket.org/DXHeroes/dx-scanner/src/master/myApp',
        path: 'myApp',
      });
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
    });

    it('returns component with local strategy and correct repositoryPath and path', () => {
      const scStr: ScanningStrategy = {
        accessType: AccessType.private,
        localPath: 'myApp',
        rootPath: undefined,
        remoteUrl: undefined,
        isOnline: true,
        serviceType: ServiceType.local,
      };
      const practiceWithContext = practiceWithContextFactory({ component: { repositoryPath: scStr.remoteUrl, path: scStr.localPath } });
      const result = ReporterUtils.getComponentsWithPractices([practiceWithContext], scStr);

      expect(result.length).toEqual(1);

      expect(result[0].component).toEqual({
        ...practiceWithContext.component,
        repositoryPath: practiceWithContext.component.repositoryPath,
        path: 'myApp',
      });
      expect(result[0].practicesAndComponents.length).toEqual(1);
      expect(result[0].practicesAndComponents[0]).toEqual(practiceWithContext);
    });
  });
});
