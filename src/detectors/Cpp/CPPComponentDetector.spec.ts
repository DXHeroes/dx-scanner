import { CPPComponentDetector } from './CPPComponentDetector';
import { ProgrammingLanguage, ProjectComponentPlatform } from '../../model';
jest.mock('../../inspectors/package/CPPPackageInspector');

describe('CPPComponentDetector', () => {
    let detector: CPPComponentDetector;
    const MockedCPPPackageInspector = <jest.Mock<CPPPackageInspector>>(<unknown>CPPPackageInpector);
    let mockCPPPackageInspector: CPPPackageInspector;

    beforeAll(async () => {
        mockCPPPackageInspector = new MockedCPPPackageInspector();
    });

    describe('Backend', () => {
        it('Detects BE', async () => {
            detector = new CPPComponentDetector(mockCPPPackageInspector);

            const components = await detector.detectComponent({ language: ProgrammingLanguage.CPlusPlus, path: './src' });

            expect(components[0].language).toEqual(ProgrammingLanguage.CPlusPlus);
            expect(components[0].path).toEqual('./src');
            expect(components[0].platform).toEqual(ProjectComponentPlatform.BackEnd);
        });
    });
});
