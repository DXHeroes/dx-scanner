import { DxPractice } from './DxPracticeDecorator';
import { IPractice } from './IPractice';
import { PracticeEvaluationResult, PracticeImpact } from '../model';
import { Container } from 'inversify';
import { Types } from '../types';

describe('DxPractice class decorator', () => {
  const mockPracticeMetadata = {
    id: 'test.mockPractice',
    name: 'Mock Practice',
    impact: PracticeImpact.high,
    suggestion: 'Practice only used for internal tests.',
    reportOnlyOnce: true,
    url: 'https://www.google.com/?q=mocks',
  };

  it('Adds the getMetadata method to the class using the decorator', () => {
    @DxPractice(mockPracticeMetadata)
    class MockPractice implements IPractice {
      async evaluate() {
        return PracticeEvaluationResult.practicing;
      }
      async isApplicable() {
        return true;
      }
    }

    const mockPractice = new MockPractice();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((mockPractice as any).getMetadata()).toMatchObject(mockPracticeMetadata);
  });

  it('Makes the class @injectable automatically', () => {
    @DxPractice(mockPracticeMetadata)
    class MockPractice implements IPractice {
      async evaluate() {
        return PracticeEvaluationResult.practicing;
      }
      async isApplicable() {
        return true;
      }
    }

    const container = new Container();
    container.bind<IPractice>(Types.Practice).to(MockPractice);
    const practice = container.get<IPractice>(Types.Practice);
    expect(practice).toBeDefined();
  });
});
